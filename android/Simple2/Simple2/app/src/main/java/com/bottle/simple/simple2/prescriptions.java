package com.bottle.simple.simple2;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.bottle.simple.simple2.R;

import org.json.JSONObject;

/**
 * This will have a list of all the prescriptions
 */
public class prescriptions extends Fragment{
    JSONObject data;

    public prescriptions() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_prescriptions, container, false);
    }

}