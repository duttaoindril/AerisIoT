package com.bottle.simple.simple2;
import java.io.Serializable;

public class Pill implements Serializable {
    private String pillName;
    private long timestamp;

    public Pill(long timestamp, String pillName) {
        this.pillName = pillName;
        this.timestamp = timestamp;
    }

    public String getpillName() {
        return pillName;
    }
    public long gettimestamp() {
        return timestamp;
    }
}