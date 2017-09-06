package com.remarkablesystems.childwatch.rules;

import java.util.function.BiFunction;
import java.util.function.BiPredicate;

public interface IRule<T, U, R> {
	
	boolean appliesTo( Object obj1, Object obj2 );

	IRule<T, U, R> when(BiPredicate<T,U> when);

	IRule<T, U, R> then(BiFunction<T, U, R> then);

	R evaluate(T fact1, U fact2 );

}