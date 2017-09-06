package com.remarkablesystems.childwatch.rules;

import java.util.function.BiFunction;
import java.util.function.BiPredicate;

public class Rule<T, U, R> implements IRule<T, U, R> {
	
	BiPredicate<T,U> when;
	BiFunction<T,U,R> then;
	T fact;
	
	/* (non-Javadoc)
	 * @see com.remarkablesystems.childwatch.rules.IRule#when(java.util.function.Predicate)
	 */
	@Override
	public IRule<T, U, R> when( BiPredicate<T,U> test ){
		this.when = test;
		return this;
	}
	
	/* (non-Javadoc)
	 * @see com.remarkablesystems.childwatch.rules.IRule#then(java.util.function.Function)
	 */
	@Override
	public IRule<T, U, R> then( BiFunction<T, U, R> consumer ){
		this.then = consumer;
		return this;
	}
	
	/* (non-Javadoc)
	 * @see com.remarkablesystems.childwatch.rules.IRule#evaluate(T)
	 */
	@Override
	public R evaluate( T fact1, U fact2 ){
		return ( getWhen().test( fact,fact2 ) )? getThen().apply(fact1,fact2) : null;
	}
	
	protected BiPredicate<T,U> getWhen(){
		return this.when;
	}
	
	protected BiFunction<T,U,R> getThen(){
		return this.then;
	}
	
	T getFact() {
		return this.fact;
	}

	@Override
	public boolean appliesTo(Object obj1, Object obj2) {
		return true;
	}
	
	
}
