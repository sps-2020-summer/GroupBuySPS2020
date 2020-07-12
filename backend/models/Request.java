package backend.models;

import backend.utilities.Utilities;
import com.google.cloud.firestore.Exclude;
import com.google.gson.stream.JsonReader;

/** Represents a request which a person makes when s/he needs help with a purchase. */
public class Request {
    private String id; 
    private String taskId;
    /** Remains as {@code null}, if it is not set using {@code setTask}. */
    private Task task;

    public Request() {
        // no argument constructor for Firestore purposes
    }
    
    /** @throws IllegalArgumentException if any parameter is {@code null} or empty. */
    public Request(String id, String taskId) throws IllegalArgumentException {
        Utilities.ensureNonNull(id, taskId);
        this.id = id;
        this.taskId = taskId;
    }

    /** @throws IllegalArgumentException if any parameter is {@code null} or empty. */
    public Request(String id, String taskId, Task task) throws IllegalArgumentException {
        Utilities.ensureNonNull(id, taskId);
        this.id = id;
        this.taskId = taskId;
        this.task = task;
    }

    /** 
     * Creates a {@code Request} by using the given {@code id} and {@code taskId}. {@code jsonString} should contain
     * the required parameters to create a {@code Task} that is associated with the request created.
     * {@code task} of the created request will thus be non-null.
     * @throws IllegalArgumentException if any required parameter cannot be found in {@code jsonString}, 
     *         or parameter value is invalid.
     */
    public static Request fromJson(String jsonString, String id, String taskId) throws IllegalArgumentException {
        Request request = new Request(id, taskId);
        request.setTask(Task.fromJson(jsonString, taskId));
        return request;
    }

    /** Assigns task to the person represented in @{code jsonString}. */
    public Task assign(String jsonString) {
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** Cancels the request and hence associated task, and returns updated request. */
    public Request cancel() {
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** 
     * Reopens request by getting a new but representative task, if the request has been closed. 
     * The updated request will be returned.
     * 
     * @param taskId Id of the new task that should be associated with request.
     */
    public Request reopen() {
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    /** Returns task associated with this request. Note that it may be {@code null}. */
    @Exclude
    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    /** Returns a view-only representation of this request that is associated with {@code Task}. */
    public static ViewableRequest getViewabale(Task task) {
        return new ViewableRequest(task);
    }

    /** Represents a request that is view-only (i.e. changes are not allowed). */
    public static class ViewableRequest {
        private final String id;
        private final String shopLocation;
        private final String expectedDeliveryTime;
        private final String item;
        /** Owner of this request. */
        private final String owner;
        private final String fee;
        /** Assignee who is supposed to fulfil this request. */
        private final String assignee;
        private final String status;

        ViewableRequest(Task task) {
            this.id = task.getId();
            this.shopLocation = task.getShopLocation();
            this.expectedDeliveryTime = task.getExpectedDeliveryTime();
            this.item = task.getItem();
            this.owner = task.getPayerName();
            this.fee = String.format("%.2f", task.getFee());
            this.status = task.getStatus().toString();
            this.assignee = task.getDoerName();
        }
    }
}
