package com.example.backend.repository;

import com.example.backend.model.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressRepository extends JpaRepository<ProgressEntity, String> {
}
