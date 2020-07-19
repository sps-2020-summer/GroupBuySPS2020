package backend.models;

import java.io.StringReader;

import backend.utilities.Utilities;
import com.google.gson.stream.JsonReader;

/** Represents an offer that is made when a person wants to help others to make a purchase. */
public class Offer {
    private String id;
    private String shopLocation;
    private String expectedDeliveryTime;
    private Status status; 

    public Offer() {
        // no argument constructor for Firestore purposes
    }

    /** @throws IllegalArgumentException if any parameter is {@code null} or empty. */
    public Offer(String id, String shopLocation, String expectedDeliveryTime, Status status) throws IllegalArgumentException {
        Utilities.ensureNonNull(id, shopLocation, expectedDeliveryTime, status);
        this.id = id;
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.status = status;
    }

    /** 
     * Creates an {@code Offer} by using parameters found in {@code jsonString} and the given {@code id}. 
     * @throws IllegalArgumentException if any required parameter cannot be found in {@code jsonString}, 
     *         or parameter value is invalid.
     */
    public static Offer fromJson(String jsonString, String id) throws IllegalArgumentException {
        String expectedDeliveryTime;
        String shopLocation;

        JsonReader reader = new JsonReader(new StringReader(jsonString));
        reader.beginObject();
        while (reader.hasNext()) {
            String name = reader.nextName();
            if (name.equals("shopLocation")) {
                shopLocation = reader.nextString();
            } else if (name.equals("expectedDeliveryTime")) {
                expectedDeliveryTime = reader.nextString();
            } else {
                reader.skipValue();
            }
        }
        reader.endObject();
        
        return new Offer(id, shopLocation, expectedDeliveryTime, Status.OPEN); // since created offers are open
    }

    /** 
     * Creates a {@code Request} instance with id {@code requestId}. The resulting task that is associated with
     * the request created will have {@code taskId} id and will satisfy the conditions specified by this offer.
     */
    public Request addRequest(String jsonString, String requestId, String taskId, String doerName) {
        String item;
        String payerName;
        double fee;
        
        JsonReader reader = new JsonReader(new StringReader(jsonString));
        reader.beginObject();
        while (reader.hasNext()) {
            String name = reader.nextName();
            if (name.equals("item")) {
                item = reader.nextString();
            } else if (name.equals("payerName")) {
                payerName = reader.nextString();
            } else if (name.equals("fee")) {
                fee = reader.nextDouble();
            } else {
                reader.skipValue();
            }
        }
        reader.endObject();

        Task task = new Task(taskId, shopLocation, expectedDeliveryTime, item, payerName, fee, 
                Status.PENDING, doerName); // status is set to 'pending' since payer and doer are both well-defined
        return new Request(requestId, taskId, task);
    }

    /** 
     * Cancels this offer and returns the updated offer. Note that this does not cancel the requests
     * and tasks that were created by users who accepted this offer.
     */
    public void cancel() {
        status = Status.CANCELLED;
    }

    /** Reopens this offer (after being closed) and returns the updated offer. */
    public void reopen() {
        status = Status.OPEN;
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

    /** Returns status as string instead of as an enum. */
    public String getStatus() {
        return status.toString();
    }

    public void setStatus(String status) {
        this.status = Status.valueOf(status);
    }

    /** Returns a view-only representation of this offer. */
    public ViewableOffer getViewabale() {
        return new ViewableOffer();
    }

    /** Represents an offer that is view-only (i.e. changes are not allowed). */
    public class ViewableOffer {
        private final String id;
        private final String shopLocation;
        private final String expectedDeliveryTime;
        private final String status;

        private ViewableOffer() {
            this.id = Offer.this.id;
            this.shopLocation = Offer.this.shopLocation;
            this.expectedDeliveryTime = Offer.this.expectedDeliveryTime;
            this.status = Offer.this.status.toString();
        }
    }
}
