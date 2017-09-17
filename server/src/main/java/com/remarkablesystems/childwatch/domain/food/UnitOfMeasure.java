package com.remarkablesystems.childwatch.domain.food;

import java.lang.reflect.Field;
import java.util.function.DoubleFunction;

public enum UnitOfMeasure {
	OZ,
	EACH,
	CUPS;		
	
	
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
		
		if( from.equals(to) ) return value;
		
		try {
			Field field = UnitOfMeasure.class.getDeclaredField(from.toString()+"_"+to.toString() );
			DoubleFunction<Double> fn = (DoubleFunction<Double>) field.get(null);
			retValue = fn.apply(value);
		} catch (Exception e) {}
		
		System.out.println( "Converted " + value + " " + from + " to " + retValue + " " + to );
		return retValue;
	}
		
	static DoubleFunction<Double> OZ_CUPS = (value) -> value / 8;
	static DoubleFunction<Double> CUPS_OZ = (value) -> value * 8;
}
