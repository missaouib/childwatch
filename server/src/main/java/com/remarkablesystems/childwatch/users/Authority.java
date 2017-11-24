package com.remarkablesystems.childwatch.users;

import java.util.Arrays;
import java.util.List;


public enum Authority {
    ADMIN,
    SCHEDULE_MANAGE,
    SCHEDULE_VIEW;
    
	public static List<Authority> ALL = Arrays.asList(Authority.ADMIN,Authority.SCHEDULE_MANAGE,Authority.SCHEDULE_VIEW );

}
