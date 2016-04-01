package com.bottle.simple.simple2;
import org.json.JSONObject;

import java.io.Serializable;

public class Prescription implements Serializable {
    private String patientID;
    private String patientName;
    private String pillID;
    private String pillName;
    private int totalPills;
    private int currentPills;
    private long expiryDate;
    private String pillUse;
    private String sideEffects;
    private int pillsInDay;
    private double pharmaHours;
    private String deviceID;

    public Prescription(String data) {
        JSONObject json = null;
        try {
            json = new JSONObject(data);
            this.setpatientID(json.getString("patientID"));
            this.setpatientName(json.getString("patientName"));
            this.setpillID(json.getString("pillID"));
            this.setpillName(json.getString("pillName"));
            this.settotalPills(json.getInt("totalPills"));
            this.setcurrentPills(json.getInt("currentPills"));
            this.setexpiryDate(json.getLong("expiryDate"));
            this.setpillUse(json.getString("pillUse"));
            this.setsideEffects(json.getString("sideEffects"));
            this.setpillsInDay(json.getInt("pillsInDay"));
            this.setpharmaHours(json.getDouble("pharmaHours"));
            this.setdeviceID(json.getString("deviceID"));
        } catch (Exception e) {

        }
    }

    public Prescription(String patientID, String patientName, String pillID, String pillName, int totalPills, int currentPills, long expiryDate, String pillUse, String sideEffects, int pillsInDay, double pharmaHours, String deviceID) {
        this.patientID = patientID;
        this.patientName = patientName;
        this.pillID = pillID;
        this.pillName = pillName;
        this.totalPills = totalPills;
        this.currentPills = currentPills;
        this.expiryDate = expiryDate;
        this.pillUse = pillUse;
        this.sideEffects = sideEffects;
        this.pillsInDay = pillsInDay;
        this.pharmaHours = pharmaHours;
        this.deviceID = deviceID;
    }

    public String getpatientID() {
        return patientID;
    }
    public String getpatientName() {
        return patientName;
    }
    public String getpillID() {
        return pillID;
    }
    public String getpillName() {
        return pillName;
    }
    public int gettotalPills() {
        return totalPills;
    }
    public int getcurrentPills() {
        return currentPills;
    }
    public long getexpiryDate() {
        return expiryDate;
    }
    public String getpillUse() {
        return pillUse;
    }
    public String getsideEffects() {
        return sideEffects;
    }
    public int getpillsInDay() {
        return pillsInDay;
    }
    public double getpharmaHours() {
        return pharmaHours;
    }
    public String getdeviceID() {
        return deviceID;
    }

    public void setpatientID(String patientID) {
        this.patientID = patientID;
    }
    public void setpatientName(String patientName) {
        this.patientName = patientName;
    }
    public void setpillID(String pillID) {
        this.pillID = pillID;
    }
    public void setpillName(String pillName) {
        this.pillName = pillName;
    }
    public void settotalPills(int totalPills) {
        this.totalPills = totalPills;
    }
    public void setcurrentPills(int currentPills) {
        this.currentPills = currentPills;
    }
    public void setexpiryDate(long expiryDate) {
        this.expiryDate = expiryDate;
    }
    public void setpillUse(String pillUse) {
        this.pillUse = pillUse;
    }
    public void setsideEffects(String sideEffects) {
        this.sideEffects = sideEffects;
    }
    public void setpillsInDay(int pillsInDay) {
        this.pillsInDay = pillsInDay;
    }
    public void setpharmaHours(double pharmaHours) {
        this.pharmaHours = pharmaHours;
    }
    public void setdeviceID(String deviceID) {
        this.deviceID = deviceID;
    }
}