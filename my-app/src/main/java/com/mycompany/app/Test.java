package com.mycompany.app;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.WriteResult;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.FirebaseOptions;

import java.io.FileInputStream;
// import java.io.FileNotFoundException;
import java.io.IOException;

import java.util.HashMap;


public class Test {

    public static void main(String[] args) throws Exception {
        FileInputStream serviceAccount = new FileInputStream("./ServiceAccountKey.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                // or initialize via the app default credentials
//                .setCredentials(GoogleCredentials.getApplicationDefault())
//                .setDatabaseUrl("https://<DATABASE_NAME>.firebaseio.com/")
                .build();

        FirebaseApp.initializeApp(options);
        // instance of firestore
        Firestore db = FirestoreClient.getFirestore();

        Test getTask = new Test();
        HashMap<String, String> quote = getTask.getTaskFromHTTP();
        ApiFuture<WriteResult> future = db.collection("taskData").document("task1")
                .set(quote);
        try {
            System.out.println("Successfully updated at: " + future.get().getUpdateTime());
        } catch (Exception e) {
            System.out.println("Something went wrong.");
        }

        // to update
//        ApiFuture<WriteResult> future = db.collection("taskData").document("task1")
//                .update(quote);
    }

    public HashMap<String, String> getTaskFromHTTP() throws IOException {
        HashMap<String, String> quoteFromHTTP = new HashMap<String,String>();
        quoteFromHTTP.put("id", "000");
        quoteFromHTTP.put("shopLocation", "placeB");
        quoteFromHTTP.put("expectedDeliveryTime", "2359");
        return quoteFromHTTP;
    }
}
