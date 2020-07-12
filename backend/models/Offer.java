package backend.models;

/** Represents an offer that is made when a person wants to help others to make a purchase. */
public class Offer {
    private String id;
    private String shopLocation;
    private String expectedDeliveryTime;
    private Status status; 

    public Offer() {
        // no argument constructor for Firestore purposes
    }

    public Offer(String id, String shopLocation, String expectedDeliveryTime, Status status) {
        // TODO: ensure that all arguments are not empty
        this.id = id;
        this.shopLocation = shopLocation;
        this.expectedDeliveryTime = expectedDeliveryTime;
        this.status = status;
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
        // TODO: add validation
        this.status = Status.valueOf(status);
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
