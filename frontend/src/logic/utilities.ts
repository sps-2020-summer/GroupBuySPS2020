/** Ensures that `...objeccts` are all non-empty, i.e. not `null`, `undefined` or `""`. */
export const ensureNonEmpty = (...objects: any[]) => {
    objects.forEach(o => {
        if (o === null) {
            throw new Error("Parameter is null");
        } else if (o === undefined) {
            throw new Error("Parameter is undefined");
        } else if (typeof o === "string" && o === "") {
            throw new Error("Given string parameter is empty");
        } 
    })
}

/** Ensures that `num` is non-negative. */
export const ensureNonNegative = (num: number) => {
	if (num < 0) {
		throw new Error("Given number is negative");
	}
};

/** 
 * Checks whether `str` is empty. 
 * @returns `true` if `str` is `""`, `undefined` or `null`.
 */
export const isEmptyString = (str: string | undefined | null) => (
    str === null || str === undefined || str === ""
);
