package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository repository;

    public void save(Progress p) {
        if (p.getId() == null || p.getId().isEmpty()) return;
        ProgressEntity e = new ProgressEntity(p.getId(), p.getText(), p.getCurrentIndex(), p.getRate());
        repository.save(e);
    }

    public Progress load(String id) {
        return repository.findById(id).map(e -> new Progress(e.getId(), e.getText(), e.getCurrentIndex(), e.getRate())).orElse(null);
    }
}
