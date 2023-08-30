package com.sparrow.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.sparrow.*")
public class ApplicationBoot {
    public static void main(String[] args) {
        new SpringApplication(ApplicationBoot.class).run(args);
    }
}

