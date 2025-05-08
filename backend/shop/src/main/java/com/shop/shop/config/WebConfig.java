package com.shop.shop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:///D:/git_project/shop_project/upload/");
    }
}

// 최흥수 집 경로
// file:///D:/git_project/shop_project/upload/
// 최흥수 학원 경로
// file:///C:/Users/ITSC/Documents/GitHub/shop_project/upload/
// 지석 학원
// C:\Users\ITSC\Desktop\shop_project-develop