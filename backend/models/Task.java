package backend.models;

import java.util.Optional;

/** 
 * Represents a task. Note that it is possible for Task to not have a doer. In this case, 
 * the task cannot be completed.
 */
public class Task {
    private final String id;
    private final String shopLocation;
    private final String expectedDeliveryTime;
    private final String item;
    private final String payerName;
    private final double fee;
    private Optional<String> doerName;
    private Status status;

    public Task(String id, String shopLocation, String expectedDeliveryTime, String item, String payerName, 
        double fee, Status status, String doerName) {
        // TODO: ensure that all fields, except doerName, are non-null
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.item = item;
        this.doerName = doerName == "" ? Optional.empty() : Optional.ofNullable(doerName);
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
     * Converts a JSON string representation of task to a {@code Task}. Assumes that all properties
     * of {@code Task}, except {@code doerName}, can be found in {@code jsonString}. 
     */
    public static Task fromJson(String jsonString) {
        // TODO: throw an error if required properties cannot be found in jsonString
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** Converts a JSON string representation of task to a {@code Task} such that it has {@code id}. */
    public static Task fromJson(String jsonString, String id) {
        throw new UnsupportedOperationException("TODO: Implement this method.");
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

    public String getShopLocation() {
        return shopLocation;
    }

    public String getExpectedDeliveryTime() {
        return expectedDeliveryTime;
    }

    public String getItem() {
        return item;
    }

    public String getPayerName() {
        return payerName;
    }

    public double getFee() {
        return fee;
    }

    public Optional<String> getDoerName() {
        return doerName;
    }

    public Status getStatus() {
        return status;
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
