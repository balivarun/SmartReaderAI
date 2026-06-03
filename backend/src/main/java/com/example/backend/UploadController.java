package com.example.backend;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class UploadController {

    private final Tika tika = new Tika();

    @PostMapping(path = "/convert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> convert(@RequestPart("file") MultipartFile file) {
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("No file");
        try {
            String text = tika.parseToString(file.getInputStream());
            return ResponseEntity.ok().body(text);
        } catch (IOException | TikaException e) {
            return ResponseEntity.status(500).body("Failed to extract text: " + e.getMessage());
        }
    }
}
