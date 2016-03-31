package com.bottle.simple.simple2;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class prescriptions extends Fragment{

    public prescriptions() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_prescriptions, container, false);

        //String url1 = "{\"contentInstances\":[{\"content\":{\"contentType\":\"application/json\",\"contentTypeBinary\":\"{\"patientID\":\"010267621\",\"patientName\":\"Oindril Dutta\",\"pillID\":\"Ac72Adarw7\",\"pillName\":\"Famotidine\",\"totalPills\":50,\"currentPills\":50,\"expiryDate\":1459256880,\"pillUse\":\"It can treat ulcers, gastroesophageal reflux disease (GERD), and conditions that cause excess stomach acid. It can also treat heartburn caused by acid indigestion.\",\"sideEffects\":\"Constipation, diarrhea, or upset stomach. Headache or dizziness. Nausea or vomiting.\",\"emergencyNum\":911,\"pillsInDay\":2,\"pharmaHours\":0.0033333333333333,\"deviceID\":\"f000da30-005a4742-4e7c2586\"}\"},\"id\":\"7cb2d310-f4cf-11e5-a389-0a344029ca9d\",\"contentSize\":543,\"creationTime\":1459160769217}]}";
        //String url2 = "{\"contentInstances\":[{\"content\":{\"contentType\":\"application/json\",\"contentTypeBinary\":\"{\"deviceID\":\"f000da30-005a4742-4e7c2586\",\"patientID\":\"010267621\",\"currentPills\":48,\"timestamp\":1459162537,\"case\":2}\"},\"id\":\"2dbb93a0-f4d4-11e5-a389-0a344029ca9d\",\"contentSize\":115,\"creationTime\":1459162784218},{\"content\":{\"contentType\":\"application/json\",\"contentTypeBinary\":\"{\"deviceID\":\"f000da30-005a4742-4e7c2586\",\"patientID\":\"010267621\",\"currentPills\":49,\"timestamp\":1459162526,\"case\":0}\"},\"id\":\"0541f180-f4d4-11e5-a389-0a344029ca9d\",\"contentSize\":115,\"creationTime\":1459162716312},{\"content\":{\"contentType\":\"application/json\",\"contentTypeBinary\":\"{\"deviceID\":\"f000da30-005a4742-4e7c2586\",\"patientID\":\"010267621\",\"currentPills\":49,\"timestamp\":1459162523,\"case\":2}\"},\"id\":\"dbfe96c0-f4d3-11e5-a389-0a344029ca9d\",\"contentSize\":115,\"creationTime\":1459162647084},{\"content\":{\"contentType\":\"application/json\",\"contentTypeBinary\":\"{\"deviceID\":\"f000da30-005a4742-4e7c2586\",\"patientID\":\"010267621\",\"currentPills\":50,\"timestamp\":1459162520,\"case\":1}\"},\"id\":\"b24ee5a0-f4d3-11e5-a389-0a344029ca9d\",\"contentSize\":115,\"creationTime\":1459162577146}]}"

        try {
            Toast.makeText(getActivity().getApplicationContext(), "try", Toast.LENGTH_LONG).show();
            JSONArray prescriptions = new DownloadTask().doInBackground("http://google.com");
            Toast.makeText(getActivity().getApplicationContext(), "catch", Toast.LENGTH_LONG).show();
            Toast.makeText(getActivity().getApplicationContext(), prescriptions.toString(), Toast.LENGTH_LONG).show();
            /*
            JSONArray prescriptions = GetJSON("Prescriptions");
            JSONArray logs = GetJSON("Logs");

            int pLength = prescriptions.length();
            int lLength = logs.length();
            Toast.makeText(getActivity().getApplicationContext(), prescriptions.toString(), Toast.LENGTH_LONG).show();
            Toast.makeText(getActivity().getApplicationContext(), "prescriptions", Toast.LENGTH_LONG).show();
            for(int i = 0; i < pLength; i++ ){
                //String contentTpeBinaryString = prescriptions.get(i).getJSONObject("content").getString("contentTypeBinary");
                Log.d(prescriptions.get(i).toString(), "HELPPP");

                //Prescription p = new Prescription(contentTpeBinaryString);

            }
*/

        } catch(Exception e) {
            e.printStackTrace();
        }
        return view;
    }

    private JSONArray GetJSON(String url) throws JSONException {
        //get JSON Data
        //String url1 = "https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Prescriptions/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3";
        //String url2 = "https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-Logs/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3";
        Toast.makeText(getActivity().getApplicationContext(), "GetJSON method", Toast.LENGTH_LONG).show();
        HttpRequest request = HttpRequest.get("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-" + url + "/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3");
        Toast.makeText(getActivity().getApplicationContext(), "GetJSON request complete", Toast.LENGTH_LONG).show();
        String body = request.body();
        Toast.makeText(getActivity().getApplicationContext(), "body", Toast.LENGTH_LONG).show();
        Toast.makeText(getActivity().getApplicationContext(), body, Toast.LENGTH_LONG).show();
        return (new JSONObject(body)).getJSONArray("contentInstances");
    }

}