package com.stackit.chat_manage_service.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:7000}")
    private String serverPort;

    @Bean
    public OpenAPI stackItOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:" + serverPort + "/api");
        devServer.setDescription("Development Server");

        Contact contact = new Contact();
        contact.setEmail("support@stackit.com");
        contact.setName("StackIt Support");
        contact.setUrl("https://stackit.com");

        License license = new License().name("MIT License").url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("StackIt Q&A Platform API")
                .version("1.0.0")
                .contact(contact)
                .description("RESTful API for StackIt - A minimal question-and-answer platform")
                .termsOfService("https://stackit.com/terms")
                .license(license);

        return new OpenAPI().info(info).servers(List.of(devServer));
    }
}