package com.shop.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShopApplication {
	public static void main(String[] args) {
		try {
			SpringApplication.run(ShopApplication.class, args);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
}
// 테스트