package com.example.backend;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(Environment env,
                                 @Value("${spring.datasource.url:}") String fallbackUrl,
                                 @Value("${spring.datasource.username:}") String fallbackUser,
                                 @Value("${spring.datasource.password:}") String fallbackPass) {
        String databaseUrl = env.getProperty("DATABASE_URL");
        String url = fallbackUrl;
        String user = fallbackUser;
        String pass = fallbackPass;

        // Use DATABASE_URL if present, otherwise fall back to the configured jdbc url.
        String effective = (databaseUrl != null && !databaseUrl.isBlank()) ? databaseUrl : fallbackUrl;
        if (effective != null && !effective.isBlank()) {
            // Support multiple formats: full JDBC url (jdbc:postgresql://...), or
            // DATABASE_URL in the form postgres://user:pass@host:port/dbname
            if (effective.startsWith("jdbc:")) {
                // Handle jdbc URLs that may incorrectly include user:pass@host (some platforms provide this)
                // e.g. jdbc:postgresql://user:pass@host:5432/db -> extract credentials
                if (effective.startsWith("jdbc:postgresql://") && effective.contains("@")) {
                    try {
                        String afterScheme = effective.substring("jdbc:postgresql://".length());
                        int at = afterScheme.indexOf('@');
                        String userInfo = afterScheme.substring(0, at);
                        String remainder = afterScheme.substring(at + 1);
                        String[] parts = userInfo.split(":", 2);
                        if (parts.length > 0) user = parts[0];
                        if (parts.length > 1) pass = parts[1];
                        url = "jdbc:postgresql://" + remainder;
                    } catch (Exception ex) {
                        url = effective;
                    }
                } else {
                    url = effective;
                }
            } else {
                try {
                    URI uri = new URI(effective);
                    String host = uri.getHost();
                    int port = uri.getPort();
                    String path = uri.getPath(); // /dbname
                    String db = (path != null && path.length() > 0) ? path.substring(1) : "";
                    String userInfo = uri.getUserInfo();
                    if (userInfo != null) {
                        String[] parts = userInfo.split(":", 2);
                        user = parts[0];
                        if (parts.length > 1) pass = parts[1];
                    }
                    StringBuilder sb = new StringBuilder();
                    sb.append("jdbc:postgresql://").append(host != null ? host : "");
                    if (port != -1) sb.append(":").append(port);
                    sb.append("/").append(db);
                    // include query if present
                    if (uri.getQuery() != null) sb.append("?").append(uri.getQuery());
                    url = sb.toString();
                } catch (Exception e) {
                    // fallback to provided jdbc url
                    url = effective;
                }
            }
        }

        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(url);
        if (user != null && !user.isBlank()) cfg.setUsername(user);
        if (pass != null && !pass.isBlank()) cfg.setPassword(pass);
        // reasonable defaults
        cfg.setMaximumPoolSize(10);
        cfg.setMinimumIdle(1);
        return new HikariDataSource(cfg);
    }
}
