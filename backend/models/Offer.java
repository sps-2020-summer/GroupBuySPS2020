package backend.models;

import backend.utilities.Utilities;
import com.google.gson.Gson;

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
        // TODO: throw an error when any property cannot be found
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** 
     * Adds a request to offer by returning a request that meet the conditions specified by this
     * task.
     */
    public Request addRequest(Request request) {
        throw new UnsupportedOperationException("TODO: implement this");
    }

    /** 
     * Cancels this offer and returns the updated offer. Note that this does not cancel the requests
     * and tasks that were created by users who accepted this offer.
     */
    public Offer cancel() {
        status = Status.CANCELLED;
        return this;
    }

    /** Reopens this offer (after being closed) and returns the updated offer. */
    public Offer reopen() {
        status = Status.OPEN;
        return this;
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
