package com.remarkablesystems.childwatch.mpr;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

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
import com.remarkablesystems.childwatch.domain.food.MealProductionRecord;
import com.remarkablesystems.childwatch.domain.food.repository.MealProductionRecordRepository;
import com.remarkablesystems.childwatch.menu.MenuController;

@RestController
public class MprPrinterController {
	public static final String MPR_TEMPLATE = "mpr-template";
	public static final String SUFFIX = ".html";
	public static final String TEMPLATE_MODE = "HTML";

	public static final String DEFAULT_RESOURCE = "/mpr-template.html";
	
	static Context context = new Context();
	
	
	@Autowired
	MealProductionRecordRepository repo;
	
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


	@RequestMapping("/mpr")
	ResponseEntity<byte[]> generateMPR(@RequestParam(value = "mpr", required = true) String mprId){
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

		MealProductionRecord mpr = repo.findOne(mprId);
		context.clearVariables();
		context.setVariable("mpr", mpr);

		String inputHtml = renderTemplate(MPR_TEMPLATE);

		generatePdf(inputHtml, outputStream);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/pdf"));
		String filename = "mpr.pdf";
		headers.add("content-disposition", "inline;filename=" + filename);
		headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(outputStream.toByteArray(), headers,
				HttpStatus.OK);
		return response;
		
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
}
