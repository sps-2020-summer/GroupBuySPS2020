package backend.models;

import java.io.StringReader;

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

    /** 
     * Assigns task to the person represented in @{code jsonString} and returns the updated task. 
     * Assumes that {@code task} is not null. To set {@code task}, {@see setTask}.
     */
    public Task assign(String jsonString) {
        if (task == null) {
            throw new IllegalStateException("Unable to assign doer to request when task is not defined." 
                + "Call setTask before calling this method.");
        }

        String doerName;
        JsonReader reader = new JsonReader(new StringReader(jsonString));
        reader.beginObject();
        while (reader.hasNext()) {
            String name = reader.nextName();
            if (name.equals("doerName")) {
                doerName = reader.nextString();
            } else {
                reader.skipValue();
            }
        }
        reader.endObject();

        task.setDoerName(doerName);
        task.setStatus(Status.PENDING);
        return task;
    }

    /** 
     * Cancels the request and hence associated task, and returns updated request. 
     * Assumes that {@code task} is not null. To set {@code task}, {@see setTask}.
     * @return Updated task.
     */
    public Task cancel() {
        if (task == null) {
            throw new IllegalStateException("Unable to cancel request when task associated with this request is not defined." 
                + "Call setTask before calling this method.");
        }

        task.cancel();
        return task;
    }

    /** 
     * Reopens request by getting a new but representative task, if the request has been cancelled. 
     * Assumes that the previous task {@code task} is not null. To set {@code task}, {@see setTask}.
     * @param taskId Id of the new task that should be associated with request.
     * @return Updated task.
     */
    public Task reopen(String taskId) {
        if (task == null) {
            throw new IllegalStateException("Unable to reopen request when previous task is not defined." 
                + "Call setTask before calling this method.");
        } else if (Status.valueOf(task.getStatus()) != Status.CANCELLED) {
            return task;
        }

        task.setId(taskId);
        task.setStatus(Status.OPEN);
        return task;
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
