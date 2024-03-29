package com.remarkablesystems.childwatch.domain.food;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.function.DoubleFunction;

import javax.persistence.Transient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public enum UnitOfMeasure {
	OUNCES,
	LBS,
	UNITS,
	GALLONS,
	CUPS,
	SERVINGS,
	TABLESPOONS;	
	
	@Transient
	static Logger logger = LoggerFactory.getLogger("UnitOfMeasure");
	
	public static boolean canConvert( UnitOfMeasure from, UnitOfMeasure to ) {
		
		if( from.equals(to) ) return true;
		try {
			String fieldName = from.toString()+"_"+to.toString();
			UnitOfMeasure.class.getDeclaredField( fieldName );
			return true;
		} catch( Exception e ) {
			e.printStackTrace();
		}
		return false;
	}
	
	@SuppressWarnings("unchecked")
	public static Double convert( double value, UnitOfMeasure from, UnitOfMeasure to ) {
		Double retValue = Double.NaN;

		if( from.equals(to) ) { 
			return value;
		}
		
		try {
			Field field = UnitOfMeasure.class.getDeclaredField(from.toString()+"_"+to.toString() );
			DoubleFunction<Double> fn = (DoubleFunction<Double>) field.get(null);
			retValue = fn.apply(value);
		} catch (Exception e) {}
		
		return retValue;
	}
		
	static DoubleFunction<Double> OUNCES_LBS = (value) -> value * 16;
	static DoubleFunction<Double> LBS_OUNCES = (value) -> value / 16;
	static DoubleFunction<Double> OUNCES_GALLONS = (value) -> value / 128;
	static DoubleFunction<Double> GALLONS_OUNCES = (value) -> value * 128;
	static DoubleFunction<Double> OUNCES_CUPS = (value) -> value / 8;
	static DoubleFunction<Double> CUPS_OUNCES = (value) -> value * 8;
	static DoubleFunction<Double> OUNCES_TABLESPOONS = (value) -> value * 2;
	static DoubleFunction<Double> TABLESPOONS_OUNCES = (value) -> value / 2;

	static DoubleFunction<Double> UNITS_SERVINGS = (value) -> value;
	static DoubleFunction<Double> SERVINGS_UNITS = (value) -> value;

	static DoubleFunction<Double> GALLONS_CUPS = (value) -> value * 16;
	static DoubleFunction<Double> CUPS_GALLONS = (value) -> value / 16;
	static DoubleFunction<Double> GALLONS_TABLESPOONS = (value) -> value * 256;
	static DoubleFunction<Double> TABLESPOONS_GALLONS = (value) -> value / 256;
	static DoubleFunction<Double> GALLONS_LBS = (value) -> value * 8.3;
	static DoubleFunction<Double> LBS_GALLONS = (value) -> value / 8.3;
	
	
	static DoubleFunction<Double> CUPS_TABLESPOONS = (value) -> value * 16;
	static DoubleFunction<Double> TABLESPOONS_CUPS = (value) -> value / 16;
	static DoubleFunction<Double> LBS_TABLESPOONS = (value) -> value * 32;
	static DoubleFunction<Double> TABLESPOONS_LBS = (value) -> value / 32;

	
	static DoubleFunction<Double> CUPS_LBS = (value) -> value / 2;
	static DoubleFunction<Double> LBS_CUPS = (value) -> value * 2;
	

	public static List<UnitOfMeasure> ALL = Arrays.asList( UnitOfMeasure.OUNCES, UnitOfMeasure.LBS, UnitOfMeasure.GALLONS, UnitOfMeasure.CUPS, UnitOfMeasure.TABLESPOONS, UnitOfMeasure.UNITS, UnitOfMeasure.SERVINGS );


}
