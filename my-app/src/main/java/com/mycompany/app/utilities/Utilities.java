package com.mycompany.app.utilities;

/** Supports general operations. */
public class Utilities {
    /** 
     * Checks whether any parameter in {@code params} is {@code null} or empty. 
     * @throws IllegalArgumentException if any parameter is {@code null} or empty.
     */
    public static void ensureNonNull(Object... params) throws IllegalArgumentException {
        for (Object param : params) {
            if (param == null) {
                throw new IllegalArgumentException("Parameter is null.");
            } else if (param instanceof String && ((String) param).isEmpty()) {
                throw new IllegalArgumentException("Given string parameter is empty.");
            }
        }
    }

    /** 
     * Checks whether {@code num} is negative. 
     * @throws IllegalArgumentException if {@code num} is negative.
     */
    public static void ensureNonNegative(Number num) {
        if (num.doubleValue() < 0) {
            throw new IllegalArgumentException("Given number is negative.");
        }
    }
}
