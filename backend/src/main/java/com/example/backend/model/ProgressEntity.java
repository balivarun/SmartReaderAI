package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class ProgressEntity {
    @Id
    private String id;

    @Lob
    private String text;

    private int currentIndex;

    private double rate;

    public ProgressEntity() {}

    public ProgressEntity(String id, String text, int currentIndex, double rate) {
        this.id = id;
        this.text = text;
        this.currentIndex = currentIndex;
        this.rate = rate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public int getCurrentIndex() { return currentIndex; }
    public void setCurrentIndex(int currentIndex) { this.currentIndex = currentIndex; }

    public double getRate() { return rate; }
    public void setRate(double rate) { this.rate = rate; }
}
