package com.bottle.simple.simple2;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

public class DownloadTask extends AsyncTask<String, Long, JSONArray> {
    protected JSONArray doInBackground(String... urls) {
        try {
            HttpRequest request = HttpRequest.get("https://api.aercloud.aeris.com/v1/16087/scls/f000da30-005a4742-4e7c2586/containers/SimpleBottle-" + urls[0] + "/contentInstances?apiKey=cf88e244-eb00-11e5-9830-4bda0975d3a3");
            String body = request.body();
            return (new JSONObject(body)).getJSONArray("contentInstances");
            /*HttpRequest request =  HttpRequest.get(urls[0]);
            File file = null;
            if (request.ok()) {
                file = File.createTempFile("download", ".tmp");
                request.receive(file);
                publishProgress(file.length());
            }
            return file;*/
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    protected void onProgressUpdate(Long... progress) {
        Log.d("MyApp", "Downloaded bytes: " + progress[0]);
    }

    protected void onPostExecute(File file) {
        if (file != null)
            Log.d("MyApp", "Downloaded file to: " + file.getAbsolutePath());
        else
            Log.d("MyApp", "Download failed");
    }
}
