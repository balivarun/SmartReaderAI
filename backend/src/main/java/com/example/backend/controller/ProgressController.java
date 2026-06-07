package com.example.backend.controller;

import com.example.backend.dto.ProgressDto;
import com.example.backend.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ProgressDto dto) {
        if (dto == null || dto.getId() == null || dto.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing id in payload");
        }
        progressService.save(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> load(@PathVariable String id) {
        ProgressDto dto = progressService.load(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }
}
