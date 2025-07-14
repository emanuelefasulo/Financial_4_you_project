package com.financial.forYou;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.financial.forYou"})
@OpenAPIDefinition(info = @Info(title = "My API", version = "1.0", description = "Descrizione dell'API"))
@EnableJpaRepositories(basePackages = "com.financial.forYou")
@EntityScan(basePackages = "com.financial.forYou")
@EnableScheduling
public class FinancialApplication {

	public static void main(String[] args) {
		SpringApplication.run(com.financial.forYou.FinancialApplication.class, args);
	}

}
