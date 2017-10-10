package com.remarkablesystems.childwatch.rules;

public class RuleViolation{

	private final RuleViolationSeverity severity;
	private final String message;
	private final IRule rule;
	
	public RuleViolation( RuleViolationSeverity severity, String message, IRule rule ) {
		this.severity = severity;
		this.message = message;
		this.rule = rule;
	}
	
	public RuleViolationSeverity getSeverity() {
		return this.severity;
	}
	
	
	public String getMessage() {
		return this.message;
	}

	public IRule getRule() {
		return this.rule;
	}
	
	public String toString() {
		return "RuleViolation: " + getRule() + " => " + getMessage();
	}
	
}
