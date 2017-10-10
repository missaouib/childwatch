package com.remarkablesystems.childwatch.rules;

import java.util.function.BiFunction;
import java.util.function.BiPredicate;

public class Rule<T, U, R> implements IRule<T, U, R> {
	
	BiPredicate<T,U> _appliesTo;
	BiPredicate<T,U> _when;
	BiFunction<T,U,R> _then;
	
	/* (non-Javadoc)
	 * @see com.remarkablesystems.childwatch.rules.IRule#when(java.util.function.Predicate)
	 */
	@Override
	public IRule<T, U, R> when( BiPredicate<T,U> when ){
		this._when = when;
		return this;
	}
	
	@Override
	public IRule<T,U,R> whenNot( BiPredicate<T,U> whenNot ){
		this._when = whenNot.negate();
		return this;
	}
	
	/* (non-Javadoc)
	 * @see com.remarkablesystems.childwatch.rules.IRule#then(java.util.function.Function)
	 */
	@Override
	public IRule<T, U, R> then( BiFunction<T, U, R> then ){
		this._then = then;
		return this;
	}
	
	/* (non-Javadoc)
	 * @see com.remarkablesystems.childwatch.rules.IRule#evaluate(T)
	 */
	@Override
	public R evaluate( T fact1, U fact2 ){		
		
		boolean applies = _appliesTo != null && _appliesTo.test( fact1,  fact2 );
				
		return (  applies &&  _when != null && _then != null &_when.test( fact1,fact2 ) )? _then.apply(fact1,fact2) : null;
	}
	

	@Override
	public IRule<T,U,R> appliesTo( BiPredicate<T,U> appliesTo ) {
		this._appliesTo = appliesTo;
		return this;
	}
	
	
}
