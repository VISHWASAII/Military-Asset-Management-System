package com.Kristalball.Military.Asset.Management.System;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
public class MilitaryAssetManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MilitaryAssetManagementSystemApplication.class, args);
	}

}
