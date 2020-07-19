package com.mycompany.app.models;

import java.io.IOException;
import java.io.StringReader;
import java.util.Optional;

import com.mycompany.app.utilities.Utilities;
import com.google.gson.stream.JsonReader;

/** 
 * Represents a task. Note that it is possible for Task to not have a doer. In this case, 
 * the task cannot be completed.
 */
public class Task {
    private String id;
    private String shopLocation;
    private String expectedDeliveryTime;
    private String item;
    private String payerName;
    private double fee;
    private Optional<String> doerName;
    private Status status;

    public Task() {
        // no argument constructor for Firestore purposes
    }

    /** @throws IllegalArgumentException if any parameter, except {@code doerName}, is {@code null} or empty */
    public Task(String id, String shopLocation, String expectedDeliveryTime, String item, String payerName, 
        double fee, Status status, String doerName) throws IllegalArgumentException {
        Utilities.ensureNonNull(id, shopLocation, expectedDeliveryTime, item, payerName, fee, status);
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.item = item;
        this.doerName = (doerName == null || doerName == "") 
                ? Optional.empty() 
                : Optional.ofNullable(doerName);
        this.payerName = payerName;
        this.status = status;
        this.fee = fee;
        this.id = id;
    }

    /** Creates a Task without a specified doer. */
    public Task(String id, String shopLocation, String expectedDeliveryTime, String item, String payerName,
        double fee) {
        this(id, shopLocation, expectedDeliveryTime, item, payerName, fee, Status.OPEN, null);
    }

    /** 
     * Creates a {@code Task} by using parameters found in {@code jsonString} and the given {@code id}. 
     * If {@code status} of this task is not specified, it defaults to {@code OPEN}.
     * @throws IllegalArgumentException if any required parameter cannot be found in {@code jsonString}, 
     *         or parameter value is invalid.
     */
    public static Task fromJson(String jsonString, String id) throws IllegalArgumentException, IOException {
        return Task.fromJson(jsonString, id, Status.OPEN);
    }

    /** 
     * Creates a {@code Task} by using parameters found in {@code jsonString} and the given {@code id}. 
     * @throws IllegalArgumentException if any required parameter cannot be found in {@code jsonString}, 
     *         or any parameter value provided is invalid.
     */
    public static Task fromJson(String jsonString, String id, Status status) throws IllegalArgumentException,
            IOException {
        String shopLocation = "";
        String expectedDeliveryTime = "";
        String item = "";
        String payerName = "";
        double fee = -1;
        String doerName = "";

        JsonReader reader = new JsonReader(new StringReader(jsonString));
        reader.beginObject();
        while (reader.hasNext()) {
            String name = reader.nextName();
            if (name.equals("shopLocation")) {
                shopLocation = reader.nextString();
            } else if (name.equals("expectedDeliveryTime")) {
                expectedDeliveryTime = reader.nextString();
            } else if (name.equals("item")) {
                item = reader.nextString();
            } else if (name.equals("payerName")) {
                payerName = reader.nextString();
            } else if (name.equals("fee")) {
                fee = reader.nextDouble();
            } else if (name.equals("doerName")) {
                doerName = reader.nextString();
            } else if (name.equals("status")) {
                status = Status.valueOf(reader.nextString().toUpperCase());
            } else {
                reader.skipValue();
            }
        }
        reader.endObject();
        reader.close();
        
        return new Task(id, shopLocation, expectedDeliveryTime, item, payerName, fee, status, doerName);
    }

    /** 
     * Reopens the task by creating a new task with a different {@code taskId} and sets doer to be empty,
     * if it has been cancelled; otherwise, the current task will be returned.
     * 
     * @param taskId The id of the new task that is associated with this task.
     */
    public Task reopenTask(String taskId) {
        if (!status.equals(Status.CANCELLED)) {
            return this;
        }
        return new Task(taskId, shopLocation, expectedDeliveryTime, item, payerName, fee);
    }

    /** Cancels the task. */
    public void cancel() {
        status = Status.CANCELLED;
    }

    /** Marks the task as complete. */
    public void markAsComplete() {
        status = Status.DONE;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShopLocation() {
        return shopLocation;
    }

    public void setShopLocation(String shopLocation) {
        this.shopLocation = shopLocation;
    }

    public String getExpectedDeliveryTime() {
        return expectedDeliveryTime;
    }

    public void setExpectedDeliveryTime(String expectedDeliveryTime) {
        this.expectedDeliveryTime = expectedDeliveryTime;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getPayerName() {
        return payerName;
    }

    public void setPayerName(String payerName) {
        this.payerName = payerName;
    }

    public double getFee() {
        return fee;
    }

    public void setFee(double fee) {
        this.fee = fee;
    }

    /** Returns doer name as string, if present; otherwise, returns empty string. */
    public String getDoerName() {
        return doerName.orElse("");
    }

    public void setDoerName(String doerName) {
        this.doerName = doerName.isEmpty() ? Optional.empty() : Optional.of(doerName);
    }

    /** Returns status as a string. */
    public String getStatus() {
        return status.toString();
    }

    /** Sets status using a string. */
    public void setStatus(String status) {
        this.status = Status.valueOf(status);
    }

    public void setStatus(Status status) {
        this.status = status;
    }

     /** Represents a task that is view-only (i.e. changes are not allowed). */
    public class ViewableTask {
        private final String id;
        private final String shopLocation;
        private final String expectedDeliveryTime;
        private final String item;
        private final String payer;
        private final String fee;
        private final String doer;
        private final String status;

        private ViewableTask() {
            this.id = Task.this.id;
            this.shopLocation = Task.this.shopLocation;
            this.expectedDeliveryTime = Task.this.expectedDeliveryTime;
            this.item = Task.this.item;
            this.payer = Task.this.payerName;
            this.fee = String.format("%.2f", Task.this.fee);
            this.status = Task.this.status.toString();
            this.doer = Task.this.doerName.orElse("");
        }
    }
}
