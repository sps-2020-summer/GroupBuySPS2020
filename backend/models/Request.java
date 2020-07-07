package backend.models;

/** Represents a request which a person makes when s/he needs help with a purchase. */
public class Request {
    private final String id; 
    private String taskId;
    
    public Request(String id, String taskId) {
        // TODO: ensure that id and taskId are non-null/empty
        this.id = id;
        this.taskId = taskId;
    }

    /** 
     * Converts a JSON string representation of request to a {@code Request}. 
     * Note that in this case, {@code id} and {@code taskId} are assumed to be found in 
     * {@code jsonString}.
     */
    public static Request fromJson(String jsonString) {
        // TODO: throw an error when any property cannot be found
        throw new UnsupportedOperationException("TODO: Implement this method.");
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
            this.assignee = task.getDoerName().orElse("");
        }
    }
}
