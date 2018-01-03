package com.remarkablesystems.childwatch.mpr;

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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealAttendanceRecord;
import com.remarkablesystems.childwatch.domain.food.MealEvent;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealProductionFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealProductionRecord;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.UnitOfMeasure;
import com.remarkablesystems.childwatch.domain.food.repository.MealAttendanceRecordRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealEventRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealFoodItemRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealProductionFoodItemRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealProductionRecordRepository;

/**
 * Meal production controller 
 * 
 * @author Matt Young
 *
 */
@RepositoryRestController
public class MprController {

	Logger logger = LoggerFactory.getLogger(getClass().getName());
	
	public static final String URL_MAPPING = "/mealProductionRecord";	
	public static final String CREATE_MAPPING = URL_MAPPING + "/create";
	public static final String REFRESH_MAPPING = URL_MAPPING + "/refresh";

	
	/** Repositories */	
	@Autowired MealProductionRecordRepository mprRepo;	
	@Autowired MealProductionFoodItemRepository mpfiRepo;	
	@Autowired MealAttendanceRecordRepository marRepo; 	
	@Autowired MealEventRepository mealEventRepo;	
	@Autowired MealFoodItemRepository mealFoodItemRepo;
	

	/**
	 * Create the meal production food items for the given record and food items
	 *  
	 * @param mpr
	 * @param items
	 * @return
	 */
	Set<MealProductionFoodItem> createProductionSet( MealProductionRecord mpr, List<MealFoodItem> items ){
		HashSet<FoodItem> productionSet = new HashSet<FoodItem>();		
		items.stream().forEach( mealFoodItem -> productionSet.add( mealFoodItem.getFoodItem() ) );
		return productionSet.stream().map( foodItem -> new MealProductionFoodItem( UUID.randomUUID().toString(), mpr, foodItem ) ).collect( Collectors.toSet() );
	}
	
	/**
	 * Create new attendance records for the given record
	 * 
	 * @param mpr
	 */
	void createAttendanceRecords( MealProductionRecord mpr ) {
		marRepo.save( AgeGroup.ALL.stream().map( ageGroup -> new MealAttendanceRecord( UUID.randomUUID().toString(), mpr, ageGroup ) ).collect( Collectors.toList()) );
	}
	
	
	/**
	 * Get the meal events for the particular record
	 * 
	 * @param mpr
	 * @return
	 */
	MealEvent getMealEventFor( MealProductionRecord mpr ) {
		return getMealEventFor( mpr.getMealDate(), mpr.getType() );
	}

	/**
	 * Get the meal events for the date and meal type
	 * 
	 * @param forDate
	 * @param type
	 * @return
	 */
	MealEvent getMealEventFor( Date forDate, MealType type ) {
		List<MealEvent> mealEvents = mealEventRepo.findByStartDate(forDate);
		mealEvents.removeIf( event -> event.getMeal().getType() != type );
		return mealEvents.size() > 0 ? mealEvents.get(0) : null;
	}

	
	/**
	 * Create food item records for the meal production record
	 * @param mpr
	 */
	void createFoodItemRecords( MealProductionRecord mpr ) {
		MealEvent event = getMealEventFor( mpr );

		if( event != null ) {
			List<MealFoodItem> foodItems = mealFoodItemRepo.findByMealId(event.getMeal().getId() );
			Set<MealProductionFoodItem> productionSet = createProductionSet( mpr, foodItems );
			if( productionSet.size() > 0 ) mpfiRepo.save( productionSet );			
		}
		
	}
	
	/**
	 * Create the meal production record for the date/type
	 * 
	 * @param forDate ISO Date for the meal production record to create
	 * @param type Meal type for the meal production record to create
	 * 
	 * @return true if an mpr was created; false otherwise
	 */
	boolean buildMpr( Date forDate, MealType type ){
		
		UUID uuid = UUID.randomUUID();			
		MealEvent event = getMealEventFor( forDate, type );
		
		boolean created = false;
		
		if( event != null ) {
			MealProductionRecord mpr = (event != null) ? new MealProductionRecord( uuid.toString(), event ) : new MealProductionRecord( uuid.toString(), forDate, type );		
			mprRepo.save(mpr);		
			createAttendanceRecords( mpr );
			createFoodItemRecords( mpr );
			created = true;
		}
		
		return created;
	}
	
	/**
	 * Remove old records for the date (if they arent locked)
	 * 
	 * @param forDate
	 */
	void removeOldRecords( Date forDate ) {
		Set<MealProductionRecord> oldSet = mprRepo.findByMealDate(forDate);
		
		// delete the old ones...		
		// only if they arent locked
		oldSet.removeIf( mpr -> mpr.isLocked() );
		oldSet.stream().forEach( mpr -> { 
			marRepo.delete(marRepo.findByMprId(mpr.getId()));
			mpfiRepo.delete(mpfiRepo.findByMprId(mpr.getId()));
		});
	
		mprRepo.delete(oldSet);		
		
	}
	
	/**
	 * MVC entry point for refreshing a meal production record by:
	 *   - Updating the food items (if not locked) - currently disabled
	 *   - Recalculating the required amounts (in case the units have changed)
	 *   
	 * @param mprId  GUID for the Meal Production Record
	 * 
	 * @return OK
	 */
	@GetMapping(REFRESH_MAPPING)
	@ResponseBody ResponseEntity<?> refreshMpr( @RequestParam(value="mpr", required = true) String mprId ){
		
		MealProductionRecord mpr = mprRepo.findOne(mprId);
		if( mpr != null ) {
			Set<MealProductionFoodItem> mpfi = mpfiRepo.findByMprId(mprId);
	
					
			mpfi.stream().forEach( item -> item.setRequired(calcRequired( item ) ) ); 
			
			mpfiRepo.save(mpfi);
		}
		return ResponseEntity.ok("OK");
	}
	
	/**
	 * MVC entry point for creating a meal production record
	 * 
	 * @param forDate ISO date for the meal production record(s) to be created
	 * 
	 * @return OK
	 */
	@GetMapping(CREATE_MAPPING)
	@ResponseBody ResponseEntity<?> createMpr(@RequestParam(value = "date", required = true) Date forDate) {

		Set<MealProductionRecord> oldSet = mprRepo.findByMealDate(forDate);

		Set<MealType> types = oldSet.stream().filter( mpr -> mpr.isLocked() ).map( mpr -> mpr.getType() ).collect( Collectors.toSet() );
		
		removeOldRecords( forDate );		
		
		
		MealType.ALL.stream()
			.filter( type -> !types.contains(type))
			.forEach( mealType -> buildMpr( forDate, mealType ) );
				
		return ResponseEntity.ok("OK");
	}

	/**
	 * Calculate the required amount for a meal production food item
	 * 
	 * @param mealProductionFoodItem
	 * @return 
	 */
	public double calcRequired(MealProductionFoodItem mealProductionFoodItem) {
		
		Double sum = 0.0;
		List<MealFoodItem> mealFoodItems = getMealFoodItems( mealProductionFoodItem );
				
		if( mealFoodItems != null ) {
			List<MealFoodItem> foodItems = mealFoodItems.stream().filter( mfi -> mfi.getFoodItem().getId() == mealProductionFoodItem.getFoodItem().getId() ).collect(Collectors.toList());		
			Map<AgeGroup,MealAttendanceRecord> marMap = new ConcurrentHashMap<AgeGroup,MealAttendanceRecord>();
			
			boolean locked = mealProductionFoodItem.getMpr().isLocked();
			
			getAttendanceRecords(mealProductionFoodItem).forEach( r -> marMap.put(r.getAgeGroup(), r) );		
					
			sum = foodItems.stream().mapToDouble( mfi -> { 
				MealAttendanceRecord mar = marMap.get(mfi.getAgeGroup());
				Double attendance = (mar == null)?  0 :
									(locked || mar.getActual() > 0 )? mar.getActual() : 
									Math.max( mar.getActual(), mar.getProjected() );
				Double fiQuantity = attendance * mfi.convertTo( mealProductionFoodItem.getUom() );
				return fiQuantity;
				} ).sum();
		}
		return sum;
	}

	/**
	 * Get the attendance records associated with the meal production food item's mpr record
	 * 
	 * @param mealProductionFoodItem
	 * @return
	 */
	private Set<MealAttendanceRecord> getAttendanceRecords(MealProductionFoodItem mealProductionFoodItem) {
		return ( mealProductionFoodItem != null && mealProductionFoodItem.getMpr() != null )? mealProductionFoodItem.getMpr().getAttendanceRecords() : new HashSet<MealAttendanceRecord>();
	}
	
	
	/**
	 * Get the meal food items associated with the meal production food item
	 * 
	 * @param mealProductionFoodItem
	 * @return
	 */
	private List<MealFoodItem> getMealFoodItems(MealProductionFoodItem mealProductionFoodItem) {
		
		MealEvent event = ( mealProductionFoodItem != null && mealProductionFoodItem.getMpr() != null) ? getMealEventFor( mealProductionFoodItem.getMpr() ) : null;
		
		Meal meal = ( event == null )? null : event.getMeal();
		
		return (meal != null)? mealFoodItemRepo.findByMealId(meal.getId()) : new ArrayList<MealFoodItem>(); 
		
	}
	

}
