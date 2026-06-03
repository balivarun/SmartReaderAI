package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody Progress p) {
        if (p == null || p.getId() == null || p.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing id in payload");
        }
        progressService.save(p);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> load(@PathVariable String id) {
        Progress p = progressService.load(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }
}
