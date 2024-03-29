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
import java.time.format.DateTimeFormatter;
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
import org.springframework.web.bind.annotation.RequestParam;
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
import com.remarkablesystems.childwatch.users.Tenant;
import com.remarkablesystems.childwatch.users.TenantRepository;

@RestController
public class MenuController {

	static Logger logger = LoggerFactory.getLogger(MenuController.class.getName());

	public static final String URL_MAPPING = "/menu";

	public static final String MENU_TEMPLATE = "menu-template";
	public static final String SUFFIX = ".html";
	public static final String TEMPLATE_MODE = "HTML";

	public static final String DEFAULT_RESOURCE = "/menu-template.html";

	@Autowired
	MealEventRepository mealEventRepo;

	@Autowired
	MealFoodItemRepository mealFoodItemRepo;
	
	@Autowired
	TenantRepository tenantRepo;

	Context context = new Context();

	public static class UriResolver implements FSUriResolver {
		/**
		 * Resolves the URI; if absolute, leaves as is, if relative, returns an absolute
		 * URI based on the baseUrl for the agent.
		 *
		 * @param uri
		 *            A URI, possibly relative.
		 *
		 * @return A URI as String, resolved, or null if there was an exception (for
		 *         example if the URI is malformed).
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
					if (baseUri.startsWith("jar")) {
						// Fix for OpenHTMLtoPDF issue-#125, URI class doesn't resolve jar: scheme urls
						// and so returns only
						// the relative part on calling base.resolve(relative) so we use the URL class
						// instead which does
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
				System.err.println("When trying to load uri(" + uri + ") with base URI(" + baseUri
						+ "), one or both were invalid URIs.");
				return null;
			} catch (MalformedURLException e) {
				System.err.println("When trying to load uri(" + uri + ") with base jar scheme URI(" + baseUri
						+ "), one or both were invalid URIs.");
				return null;
			}
		}
	}

	/**
	 * 
	 * @param templateName
	 * @return
	 */
	String renderTemplate(String templateName) {
		ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
		templateResolver.setSuffix(SUFFIX);
		templateResolver.setTemplateMode(TEMPLATE_MODE);

		TemplateEngine templateEngine = new TemplateEngine();
		templateEngine.setTemplateResolver(templateResolver);

		// Get the plain HTML with the resolved ${name} variable!
		return templateEngine.process(templateName, context);
	}

	/**
	 * 
	 * @param inputHtml
	 * @param outputStream
	 */
	void generatePdf(String inputHtml, OutputStream outputStream) {
		PdfRendererBuilder builder = new PdfRendererBuilder();

		builder.withHtmlContent(inputHtml, MenuController.class.getResource(DEFAULT_RESOURCE).toExternalForm());

		builder.toStream(outputStream);
		builder.useUriResolver(new UriResolver());

		try {
			builder.run();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 
	 * @param events
	 * @param showInfant
	 */
	void buildContext(List<MealEvent> events, boolean showInfant) {

		HashMap<String, HashMap<String, Meal>> hm = new HashMap<String, HashMap<String, Meal>>();

		HashMap<String, List<FoodItem>> meals = new HashMap<String, List<FoodItem>>();

		for (MealType mealType : MealType.values()) {
			hm.put(mealType.toString(), new HashMap<String, Meal>());
			logger.info( "adding meal type " + mealType.toString() );
		}

		events.stream().forEach(event -> {
			java.util.Date startDate = new Date(event.getStartDate().getTime());
			
			LocalDateTime start = LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault());
			logger.info("putting meal of type " + event.getMeal().getType().toString() + " to "
					+ start.getDayOfWeek().toString());
			hm.get(event.getMeal().getType().toString()).put(start.getDayOfWeek().toString(), event.getMeal());
			logger.info( "got meal type " + event.getMeal().getType().toString() );
			logger.info( "added " + start.getDayOfWeek().toString()  + " meal " + event.getMeal().getId() );
			List<FoodItem> foodItems = buildMealFoodItems(event.getMeal(), showInfant);
			logger.info( "contains key = " + hm.get(event.getMeal().getType().toString()).containsKey("THURSDAY") );
			meals.put(event.getMeal().getId(), foodItems);
		});
		context.setVariable("meals", hm);
		context.setVariable("foodItems", meals);
	}

	/**
	 * 
	 * @param meal
	 * @param showInfant
	 * @return
	 */
	List<FoodItem> buildMealFoodItems(Meal meal, boolean showInfant) {
		ArrayList<FoodItem> foodItems = new ArrayList<FoodItem>();

		List<MealFoodItem> mealFoodItems = mealFoodItemRepo.findByMealId(meal.getId());
		mealFoodItems.stream().forEach(mealFoodItem -> {

			FoodItem foodItem = (mealFoodItem.getFoodItem().hasTag("MILK"))
					? new FoodItem("AGEAPPROPRIATEMILK", "Age Appropriate Milk *", Arrays.asList("MILK"))
					: mealFoodItem.getFoodItem();

			if (!foodItems.contains(foodItem) && (showInfant || !mealFoodItem.getAgeGroup().isInfant())) {
				foodItems.add(foodItem);
			}
		});
		foodItems.sort(FoodItem.byFoodItemCategory);

		foodItems.stream().forEach(foodItem -> logger.info(foodItem.getShortDescription()));

		return foodItems;
	}

	/**
	 * 
	 * @param startDate
	 * @param showInfant
	 * @return
	 */
	@RequestMapping(URL_MAPPING)
	ResponseEntity<byte[]> generateMenu(@RequestParam(value = "start", required = true) String startDate,
			@RequestParam(value = "showInfant", required = false) Boolean showInfant,
			@RequestParam(value ="showWeekends", required = false) Boolean showWeekends,
			@RequestParam( value="tenant", required = true) String tenantId ) {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		
		Tenant tenant = tenantRepo.findOne(tenantId);
			
		if( showWeekends == null ) showWeekends = false;
		if (showInfant == null) showInfant = false;
		LocalDate start = LocalDate.parse(startDate);
		LocalDate end = start.plusDays( (showWeekends)? 7: 5 );
		
		Date begin = Date.from(start.atStartOfDay(ZoneId.systemDefault()).toInstant());
		Date ending = Date.from(end.atStartOfDay(ZoneId.systemDefault()).toInstant());
		
		logger.info( "Fetching meal events between " + begin + " and " + ending );
		List<MealEvent> events = mealEventRepo.findByStartDateGreaterThanEqualAndStartDateLessThanEqual( begin, ending );

		logger.info("Found " + events.size() + " events between " + start.format(DateTimeFormatter.ISO_DATE) + " and "
				+ end.format(DateTimeFormatter.ISO_DATE));

		context.setVariable("forDate", start.getMonth() + " " + start.getDayOfMonth() + " - "
				+ ((start.getMonthValue() == end.getMonthValue()) ? "" : end.getMonth()) + " " + (end.getDayOfMonth()-1));
		context.setVariable("showInfant", showInfant);
		
		context.setVariable("MEAL_TYPES", buildMealTypes(tenant) );
		context.setVariable("MEAL_DAYS", buildMealDays(showWeekends) );
		buildContext(events, showInfant);

		String inputHtml = renderTemplate(MENU_TEMPLATE);

		generatePdf(inputHtml, outputStream);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/pdf"));
		String filename = "menu-" + context.getVariable("forDate") + ".pdf";
		headers.add("content-disposition", "inline;filename=" + filename);
		headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(), headers,
				HttpStatus.OK);
		return response;

	}
	
	Object[] buildMealTypes(Tenant tenant ){
		
		ArrayList<String> mealTypes = new ArrayList<String>();
		if( tenant != null && tenant.isSupportingBreakfast() ) mealTypes.add("BREAKFAST");
		if( tenant != null && tenant.isSupportingAMSnack() ) mealTypes.add("AM_SNACK");
		if( tenant != null && tenant.isSupportingLunch() ) mealTypes.add("LUNCH");
		if( tenant != null && tenant.isSupportingPMSnack() ) mealTypes.add("PM_SNACK");
		if( tenant != null && tenant.isSupportingSupper() ) mealTypes.add("SUPPER");
		if( tenant != null && tenant.isSupportingEVSnack() ) mealTypes.add("EV_SNACK");
		return mealTypes.toArray();
	}
	
	String[] buildMealDays(Boolean showWeekends) {
		return ( showWeekends != null && showWeekends.booleanValue() )? 
				new String[] { "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY" } :
				new String[] { "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" };	
	}
}
