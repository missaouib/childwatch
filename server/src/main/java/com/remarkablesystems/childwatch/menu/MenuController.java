package com.remarkablesystems.childwatch.menu;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.loader.custom.Return;
import org.hibernate.stat.CollectionStatistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import com.openhtmltopdf.extend.FSUriResolver;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.remarkablesystems.childwatch.domain.food.AgeGroup;
import com.remarkablesystems.childwatch.domain.food.FoodItem;
import com.remarkablesystems.childwatch.domain.food.Meal;
import com.remarkablesystems.childwatch.domain.food.MealEvent;
import com.remarkablesystems.childwatch.domain.food.MealFoodItem;
import com.remarkablesystems.childwatch.domain.food.MealType;
import com.remarkablesystems.childwatch.domain.food.repository.MealEventRepository;
import com.remarkablesystems.childwatch.domain.food.repository.MealFoodItemRepository;

@RestController
public class MenuController {
	
	static Logger logger = LoggerFactory.getLogger(MenuController.class.getName() );
	
	public static final String URL_MAPPING = "/menu";
	
	public static final String MENU_TEMPLATE = "template";
	public static final String SUFFIX = ".html";
	public static final String TEMPLATE_MODE = "HTML";
	
	public static final String DEFAULT_RESOURCE = "/template.html";
	
	
	@Autowired
	MealEventRepository mealEventRepo;
	
	@Autowired
	MealFoodItemRepository mealFoodItemRepo;
	
	static Context context = new Context();
	
	public static class UriResolver implements FSUriResolver {
		/**
		 * Resolves the URI; if absolute, leaves as is, if relative, returns an
		 * absolute URI based on the baseUrl for the agent.
		 *
		 * @param uri
		 *            A URI, possibly relative.
		 *
		 * @return A URI as String, resolved, or null if there was an exception
		 *         (for example if the URI is malformed).
		 */
		@Override
		public String resolveURI(String baseUri, String uri) {
			if (uri == null || uri.isEmpty())
				return null;
			
			try {
				URI possiblyRelative = new URI(uri);
				
				if (possiblyRelative.isAbsolute()) {
					return possiblyRelative.toString();
				} else {
				    if(baseUri.startsWith("jar")) {
				    	// Fix for OpenHTMLtoPDF issue-#125, URI class doesn't resolve jar: scheme urls and so returns only
				    	// the relative part on calling base.resolve(relative) so we use the URL class instead which does
				    	// understand jar: scheme urls.
				    	URL base = new URL(baseUri);
				        URL absolute = new URL(base, uri);
				        return absolute.toString();
				    } else {
						URI base = new URI(baseUri);
						URI absolute = base.resolve(uri);
						return absolute.toString();				    	
				    }
				}
			} catch (URISyntaxException e) {
				System.err.println("When trying to load uri(" + uri + ") with base URI(" + baseUri + "), one or both were invalid URIs." );
				return null;
			} catch (MalformedURLException e) {
				System.err.println("When trying to load uri(" + uri + ") with base jar scheme URI(" + baseUri + "), one or both were invalid URIs." );
				return null;
			}
		}
	}
	
	
	String renderTemplate( String templateName ) {
		ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		templateResolver.setSuffix(SUFFIX);
		templateResolver.setTemplateMode(TEMPLATE_MODE);
		 
		TemplateEngine templateEngine = new TemplateEngine();
		templateEngine.setTemplateResolver(templateResolver);
		 
		// Get the plain HTML with the resolved ${name} variable!
		return templateEngine.process(templateName, context);		
	}
	
	void generatePdf( String inputHtml, OutputStream outputStream ) {
		PdfRendererBuilder builder = new PdfRendererBuilder();

		builder.withHtmlContent(inputHtml, MenuController.class.getResource(DEFAULT_RESOURCE).toExternalForm() );
		
		builder.toStream(outputStream);
		builder.useUriResolver( new UriResolver() );
		
		try {
			builder.run();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	void buildContext( List<MealEvent> events ){
		
		HashMap<String,HashMap<String,Meal>> hm = new HashMap<String,HashMap<String,Meal>>();
		
		HashMap<String,List<FoodItem>> meals = new HashMap<String,List<FoodItem>>();
		
		for( MealType mealType : MealType.values() ) hm.put( mealType.toString(), new HashMap<String,Meal>() );
		
		events.stream().forEach( event -> {
			LocalDateTime start = LocalDateTime.ofInstant(event.getStartDate().toInstant(), ZoneId.systemDefault());
			logger.info( "putting meal of type " + event.getMeal().getType().toString() + " to " + start.getDayOfWeek().toString() ); 
			hm.get(event.getMeal().getType().toString()).put( start.getDayOfWeek().toString(), event.getMeal() );
			List<FoodItem> foodItems = buildMealFoodItems(event.getMeal() );
			meals.put( event.getMeal().getId(), foodItems );
		});
		context.setVariable("meals", hm );
		context.setVariable("foodItems", meals);
	}
	
		
	List<FoodItem> buildMealFoodItems( Meal meal ) {
		ArrayList<FoodItem> foodItems = new ArrayList<FoodItem>();
		
		List<MealFoodItem> mealFoodItems = mealFoodItemRepo.findByMealId(meal.getId());
		mealFoodItems.stream().forEach( mealFoodItem -> {
			
			FoodItem foodItem = (mealFoodItem.getFoodItem().hasTag("MILK") )? new FoodItem("AGEAPPROPRIATEMILK", "Age Appropriate Milk *", Arrays.asList("MILK")) : mealFoodItem.getFoodItem();
			
			
			if( !foodItems.contains( foodItem ) && !mealFoodItem.getAgeGroup().isInfant()  ) {
				foodItems.add(foodItem);  
			}
		});				
		foodItems.sort( FoodItem.byFoodItemCategory );
		
		foodItems.stream().forEach( foodItem -> logger.info( foodItem.getShortDescription() ) );
		
		return foodItems;
	}
	
	
	
	@RequestMapping( URL_MAPPING )
	ResponseEntity<byte[]> generateMenu() {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		
		LocalDate start = LocalDate.of( 2017,11,27 );
		LocalDate end = LocalDate.of( 2017, 12, 2);
		List<MealEvent> events = mealEventRepo.findBetween(  Date.from(start.atStartOfDay(ZoneId.systemDefault()).toInstant()),  Date.from(end.atStartOfDay(ZoneId.systemDefault()).toInstant()));

		logger.info( "Found " + events.size() + " events between 11-27-2017 and 12-02-2017" );
						
		context.clearVariables();
		buildContext(events);
		
		String inputHtml = renderTemplate( MENU_TEMPLATE );

		generatePdf( inputHtml, outputStream );
		
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.parseMediaType("application/pdf"));
	    String filename = "output.pdf";
	    headers.add("content-disposition", "inline;filename=" + filename);
	    headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
	    ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(), headers, HttpStatus.OK);
	    return response;
		
		
	}
}
