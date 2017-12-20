package com.remarkablesystems.childwatch.mpr;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import com.openhtmltopdf.extend.FSUriResolver;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealAttendanceRecord;
import com.remarkablesystems.childwatch.domain.food.MealEvent;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealProductionFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealProductionRecord;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.repository.MealAttendanceRecordRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealEventRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealFoodItemRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealProductionFoodItemRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealProductionRecordRepository;
import com.remarkablesystems.childwatch.menu.MenuController;
import com.remarkablesystems.childwatch.menu.MenuController.UriResolver;

@RepositoryRestController
public class MprController {

	Logger logger = LoggerFactory.getLogger(getClass().getName());
	
	public static final String URL_MAPPING = "/mealProductionRecord/create";
	



	
	@Autowired
	MealProductionRecordRepository mprRepo;
	
	@Autowired
	MealProductionFoodItemRepository mpfiRepo;
	
	@Autowired
	MealAttendanceRecordRepository marRepo; 
	
	@Autowired
	MealEventRepository mealEventRepo;
	
	@Autowired
	MealFoodItemRepository mealFoodItemRepo;
	

	
	Set<MealProductionFoodItem> createProductionSet( MealProductionRecord mpr, List<MealFoodItem> items ){
		HashSet<FoodItem> productionSet = new HashSet<FoodItem>();
		
		items.stream().forEach( mealFoodItem -> productionSet.add( mealFoodItem.getFoodItem() ) );
		
		
		return productionSet.stream().map( foodItem -> new MealProductionFoodItem( UUID.randomUUID().toString(), mpr, foodItem ) ).collect( Collectors.toSet() );
	}
	
	void createAttendanceRecords( MealProductionRecord mpr ) {
		marRepo.save( AgeGroup.ALL.stream().map( ageGroup -> new MealAttendanceRecord( UUID.randomUUID().toString(), mpr, ageGroup ) ).collect( Collectors.toList()) );
	}
	
	
	MealEvent getMealEventFor( MealProductionRecord mpr ) {
		return getMealEventFor( mpr.getMealDate(), mpr.getType() );
	}

	MealEvent getMealEventFor( Date forDate, MealType type ) {
		List<MealEvent> mealEvents = mealEventRepo.findByStartDate(forDate);
		mealEvents.removeIf( event -> event.getMeal().getType() != type );
		return mealEvents.size() > 0 ? mealEvents.get(0) : null;
	}

	
	void createFoodItemRecords( MealProductionRecord mpr ) {
		MealEvent event = getMealEventFor( mpr );

		if( event != null ) {
			List<MealFoodItem> foodItems = mealFoodItemRepo.findByMealId(event.getMeal().getId() );
			Set<MealProductionFoodItem> productionSet = createProductionSet( mpr, foodItems );
			logger.info( "Production food set contains {} item(s)", productionSet.size() );
			if( productionSet.size() > 0 ) mpfiRepo.save( productionSet );			
		}
		
	}
	
	void createMpr( Date forDate, MealType type ){
		UUID uuid = UUID.randomUUID();			
		MealEvent event = getMealEventFor( forDate, type );
		logger.info("event forDate={} type={} ={}", forDate, type, event != null );
		MealProductionRecord mpr = (event != null) ? new MealProductionRecord( uuid.toString(), event ) : new MealProductionRecord( uuid.toString(), forDate, type );		
		mprRepo.save(mpr);		
		createAttendanceRecords( mpr );
		createFoodItemRecords( mpr );
	}

	
	@GetMapping(URL_MAPPING)
	@ResponseBody ResponseEntity<?> postMpr(@RequestParam(value = "date", required = true) Date forDate ) {
			
		// delete the old ones...
		Set<MealProductionRecord> oldSet = mprRepo.findByMealDate(forDate);		
		oldSet.stream().forEach( mpr -> { 
			marRepo.delete(marRepo.findByMprId(mpr.getId()));
			mpfiRepo.delete(mpfiRepo.findByMprId(mpr.getId()));
		});
		
		logger.info( "Removing {} old records", oldSet.size() );
		
		mprRepo.delete(oldSet);
		
		MealType.ALL.stream().forEach( mealType -> createMpr( forDate, mealType ) );
				
		return ResponseEntity.ok("OK");
	}

	public double calcRequired(MealProductionFoodItem mealProductionFoodItem) {
		
		Double sum = 0.0;
		List<MealFoodItem> mealFoodItems = getMealFoodItems( mealProductionFoodItem );
		
		logger.info( "mealFoodItems has {} items", mealFoodItems.size() );
		
		if( mealFoodItems != null ) {
			List<MealFoodItem> foodItems = mealFoodItems.stream().filter( mfi -> mfi.getFoodItem().getId() == mealProductionFoodItem.getFoodItem().getId() ).collect(Collectors.toList());		
			Map<AgeGroup,MealAttendanceRecord> marMap = new ConcurrentHashMap<AgeGroup,MealAttendanceRecord>();
			
			getAttendanceRecords(mealProductionFoodItem).forEach( r -> marMap.put(r.getAgeGroup(), r) );		
					
			sum = foodItems.stream().mapToDouble( mfi -> { 
				MealAttendanceRecord mar = marMap.get(mfi.getAgeGroup());
				Double attendance = (mar != null)?mar.getActual():0;
				Double fiQuantity = attendance * mfi.convertTo( mealProductionFoodItem.getUnit() );
				logger.info( "for foodItem {}: attendance = {}; quantity = {}", mfi.getFoodItem().getDescription(), attendance, fiQuantity );
				return fiQuantity;
				} ).sum();
		}
		return sum;
	}

	private Set<MealAttendanceRecord> getAttendanceRecords(MealProductionFoodItem mealProductionFoodItem) {
		return ( mealProductionFoodItem != null && mealProductionFoodItem.getMpr() != null )? mealProductionFoodItem.getMpr().getAttendanceRecords() : new HashSet<MealAttendanceRecord>();
	}

	private List<MealFoodItem> getMealFoodItems(MealProductionFoodItem mealProductionFoodItem) {
		if( mealProductionFoodItem == null ) logger.info( "mealProductionFoodItem is null");
		if( mealProductionFoodItem.getMpr() == null ) logger.info( "mealProductionFoodItem.mpr is null");
		if( mealProductionFoodItem.getMpr().getMealEvent() == null ) logger.info( "mealProductionFoodItem.mpr.mealEvent is null");

		Meal meal = ( mealProductionFoodItem == null || mealProductionFoodItem.getMpr() == null || mealProductionFoodItem.getMpr().getMealEvent() == null )? null : mealProductionFoodItem.getMpr().getMealEvent().getMeal();
		
		return (meal != null)? mealFoodItemRepo.findByMealId(meal.getId()) : new ArrayList<MealFoodItem>(); 
		
	}
	

}
