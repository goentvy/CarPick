package com.carpick.global.logging;
import org.slf4j.Logger;

import com.carpick.global.util.ProfileResolver;

import lombok.experimental.UtilityClass;

@UtilityClass
public class SecurityLogger {
	
	public static void error(
	        Logger log,
	        ProfileResolver profileResolver,
	        String message,
	        Object arg,
	        Exception e
	) {
	    if (profileResolver.isProd()) {
	        log.error(
	            message + ", exception={}",
	            arg,
	            e.getClass().getSimpleName()
	        );
	    } else {
	        log.error(
	            message,
	            arg,
	            e
	        );
	    }
	}

}