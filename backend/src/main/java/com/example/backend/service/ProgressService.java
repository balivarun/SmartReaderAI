package com.example.backend.service;

import com.example.backend.dto.ProgressDto;
import com.example.backend.model.ProgressEntity;
import com.example.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository repository;

    public void save(ProgressDto dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) return;
        ProgressEntity entity = new ProgressEntity(
                dto.getId(),
                dto.getText(),
                dto.getCurrentIndex(),
                dto.getRate()
        );
        repository.save(entity);
    }

    public ProgressDto load(String id) {
        return repository.findById(id)
                .map(entity -> new ProgressDto(
                        entity.getId(),
                        entity.getText(),
                        entity.getCurrentIndex(),
                        entity.getRate()
                ))
                .orElse(null);
    }
}
