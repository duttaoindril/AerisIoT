package com.bottle.simple.simple2;

import android.app.ActionBar;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.Button;
import android.widget.ListView;

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
        View view = inflater.inflate(R.layout.fragment_prescriptions, container, false);
/*
        ListView listView = new ListView(getActivity());

        //int items = data.length();
        int items = 10;
        for (int i=0; i<items; i++) {
            Button button = new Button(getActivity());
            button.setText("button");
            listView.addView(button);
        }
*/
        return view;
    }

}