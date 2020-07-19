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

//package com.google.sps.servlets;
package com.mycompany.servlets;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Query;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;
import com.mycompany.app.models.Offer;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@WebServlet("/offer/*")
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
        Optional<String> uuid = readCookie(request, "uuid");
        if(!uuid.isPresent()) {
            // not logged in, kick out
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String shopLocation = request.getParameter("shopLocation");
        String expectedDeliveryTime = request.getParameter("expectedDeliveryTime");

        // TODO use models
        Map<String, Object> data = new HashMap<>();
        data.put("uuid",  uuid.get());
        data.put("shopLocation", shopLocation);
        data.put("expectedDeliveryTime", expectedDeliveryTime);
        data.put("status", "OPEN"); //default

        System.out.println(shopLocation);
        System.out.println(expectedDeliveryTime);

        ApiFuture<DocumentReference> addedDocRef = db.collection("offer").add(data);
        try {
            System.out.println("Added document with ID: " + addedDocRef.get().getId());
        } catch(Exception e) {
            System.out.println("Error");
        }
    }

   @Override
   public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
       // TODO: add uuid param in offer model

        //String json = gson.toJson(xxx);
       // offer?findByStatus={status}
       // offer?offerId={offerId}
       // offer
       response.setContentType("text/html;");
       response.getWriter().println("Hello World!");
       String pathInfo = request.getPathInfo();
       String offerId = request.getParameter("offerId");
       String status = request.getParameter("status");

       System.out.println("path: " + pathInfo);
       System.out.println("offerId: " + offerId);
       System.out.println("status: " + status);
       Optional<String> uuid = readCookie(request, "uuid");

       if(!uuid.isPresent()) {
           // not logged in, kick out
           response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           return;
       }
       try {
//           ApiFuture<QuerySnapshot> future = db.collection("offer").whereEqualTo("uuid", uuid.get()).get();
           CollectionReference offersRef = db.collection("offer");
           Query query = offersRef.whereEqualTo("uuid", uuid.get());

           if(status != null) {
               query = query.whereEqualTo("status", status);
           }

           List<Offer> offers = new ArrayList<>();
           List<QueryDocumentSnapshot> documents = query.get().get().getDocuments();
           for (QueryDocumentSnapshot document : documents) {
               Offer offer = document.toObject(Offer.class).withId(document.getId());
               offers.add(offer);
           }
           response.setContentType("application/json;");
           response.getWriter().println(gson.toJson(offers));
       } catch(Exception e) {
           // TODO log error
           System.out.println(e);
           e.printStackTrace();
           response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
       }
   }

   // TOOD move this to a utils class
    public Optional<String> readCookie(HttpServletRequest request, String key) {
        if (request.getCookies() == null) {
            return Optional.ofNullable(null);
        }
        return Arrays.stream(request.getCookies())
                .filter(c -> key.equals(c.getName()))
                .map(Cookie::getValue)
                .findAny();
    }
}