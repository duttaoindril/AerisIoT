package com.bottle.simple.simple2;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

public class Log implements Serializable {
    private long timestamp;
    private String deviceID;
    private String patientID;
    private int currentPills;
    private int option;

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setDeviceID(String deviceID) {
        this.deviceID = deviceID;
    }

    public void setPatientID(String patientID) {
        this.patientID = patientID;
    }

    public void setCurrentPills(int currentPills) {
        this.currentPills = currentPills;
    }

    public void setOption(int option) {
        this.option = option;
    }

    public Log(String data) {
        JSONObject json = null;
        try {
            json = new JSONObject(data);
            this.setTimestamp(json.getLong("timestamp"));
            this.setDeviceID(json.getString("deviceID"));
            this.setPatientID(json.getString("patientID"));
            this.setCurrentPills(json.getInt("currentPills"));
            this.setOption(json.getInt("option"));
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    public Log(long timestamp, String deviceID, String patientID, int currentPills, int option) {
        this.timestamp = timestamp;
        this.deviceID = deviceID;
        this.patientID = patientID;
        this.currentPills = currentPills;
        this.option = option;
    }

    public long gettimestamp() {
        return timestamp;
    }
    public String getdeviceID() {
        return deviceID;
    }
    public String getpatientID() {
        return patientID;
    }
    public int getcurrentPills() {
        return currentPills;
    }
    public int getoption() {
        return option;
    }
}