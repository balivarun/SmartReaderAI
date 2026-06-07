package com.example.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    public DataSource dataSource(Environment env,
                                 @Value("${spring.datasource.url:}") String fallbackUrl,
                                 @Value("${spring.datasource.username:}") String fallbackUser,
                                 @Value("${spring.datasource.password:}") String fallbackPass) {
        String databaseUrl = env.getProperty("DATABASE_URL");
        String url = fallbackUrl;
        String user = fallbackUser;
        String pass = fallbackPass;

        String effective = (databaseUrl != null && !databaseUrl.isBlank()) ? databaseUrl : fallbackUrl;
        if (effective != null && !effective.isBlank()) {
            if (effective.startsWith("jdbc:")) {
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
                    String path = uri.getPath();
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
                    if (uri.getQuery() != null) sb.append("?").append(uri.getQuery());
                    url = sb.toString();
                } catch (Exception e) {
                    url = effective;
                }
            }
        }

        if (url != null && url.startsWith("jdbc:postgresql://") && (user == null || user.isBlank())) {
            if (!url.contains("localhost") && !url.contains("127.0.0.1")) {
                throw new IllegalStateException("Database credentials not provided. Set DATABASE_URL with credentials or set DATABASE_USER and DATABASE_PASSWORD environment variables.");
            }
        }

        try {
            String uriStr = url;
            if (uriStr != null && uriStr.startsWith("jdbc:postgresql://")) {
                uriStr = uriStr.substring("jdbc:".length());
            }
            if (uriStr != null) {
                URI u = new URI(uriStr);
                String host = u.getHost();
                String path = u.getPath();
                String db = (path != null && path.length() > 0) ? path.substring(1) : "";
                log.info("Connecting to database host='{}' db='{}' user='{}'", host, db, (user == null ? "" : user));
            }
        } catch (Exception ex) {
            log.debug("Failed to parse JDBC URL for logging", ex);
        }

        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl(url);
        if (user != null && !user.isBlank()) cfg.setUsername(user);
        if (pass != null && !pass.isBlank()) cfg.setPassword(pass);
        cfg.setMaximumPoolSize(10);
        cfg.setMinimumIdle(1);
        return new HikariDataSource(cfg);
    }
}
