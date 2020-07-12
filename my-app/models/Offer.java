package backend.models;

/** Represents an offer that is made when a person wants to help others to make a purchase. */
public class Offer {
    private final String id;
    private final String shopLocation;
    private final String expectedDeliveryTime;
    private Status status; 

    public Offer(String id, String shopLocation, String expectedDeliveryTime, Status status) {
        // TODO: ensure that all arguments are not empty
        this.id = id;
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.status = status;
    }

    /** 
     * Converts a JSON string representation of task to an {@code Offer}. Assumes that all properties
     * of {@code Offer} can be found in {@code jsonString}. 
     */
    public static Offer fromJson(String jsonString) {
        // TODO: throw an error when any property is not defined in jsonString
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** Converts a JSON string representation of task to a {@code Offer} such that it has {@code id}. */
    public static Offer fromJson(String jsonString, String id) {
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** 
     * Adds a request to offer by returning a request that meet the conditions specified by this
     * task.
     */
    public Request addRequest(String jsonString) {
        throw new UnsupportedOperationException("TODO: Implement this method.");
    }

    /** 
     * Cancels this offer and returns the updated offer. Note that this does not cancel the requests
     * and tasks that were created by users who accepted this offer.
     */
    public Offer cancel() {
        status = Status.CANCELLED;
        return this;
    }

    /** Reopens this offer and returns the updated offer. */
    public Offer reopen() {
        status = Status.OPEN;
        return this;
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
