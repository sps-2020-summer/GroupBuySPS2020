// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.WriteResult;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.FirebaseOptions;

import java.io.IOException;
import java.io.FileInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/offer")
public class OfferServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private Firestore db;
    @Override
    public void init() {
    }

    public OfferServlet() throws Exception {

        // Note: do this on terminal before executing
        // export GOOGLE_APPLICATION_CREDENTIALS="<<absolute-file-path>>GroupBuySPS2020/my-app/ServiceAccountKey.json"

        System.out.println(System.getProperty("user.dir"));

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .build();

        FirebaseApp.initializeApp(options);
        // instance of firestore
        db = FirestoreClient.getFirestore();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String shopLocation = request.getParameter("shopLocation");
        String expectedDeliveryTime = request.getParameter("expectedDeliveryTime");

        Map<String, Object> data = new HashMap<>();
        data.put("shopLocation", shopLocation);
        data.put("expectedDeliveryTime", expectedDeliveryTime);
        data.put("status", "open"); //default

        System.out.println(shopLocation);
        System.out.println(expectedDeliveryTime);

        ApiFuture<DocumentReference> addedDocRef = db.collection("offer").add(data);
        try {
            System.out.println("Added document with ID: " + addedDocRef.get().getId());
        } catch(Exception e) {
            System.out.println("Error");
        }
    }

//    @Override
//    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        String json = gson.toJson(xxx);
//        response.setContentType("text/html;");
//        response.getWriter().println(json);
//    }
}