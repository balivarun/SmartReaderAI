package com.example.backend;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        // In production, secret should be a long, random value. Here we derive a key and ensure
        // it meets the minimum length requirements for HMAC-SHA keys by padding if necessary.
        byte[] bs = secret.getBytes();
        if (bs.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(bs, 0, padded, 0, Math.min(bs.length, 32));
            for (int i = bs.length; i < 32; i++) padded[i] = (byte) 0x0;
            bs = padded;
        }
        this.key = Keys.hmacShaKeyFor(bs);
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateAndGetSubject(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}
