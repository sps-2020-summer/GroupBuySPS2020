import * as moment from "moment";
import { Status } from "../types";
/** Ensures that `...objeccts` are all non-empty, i.e. not `null`, `undefined` or `""`. */
export const ensureNonEmpty = (...objects: any[]) => {
  objects.forEach((o) => {
    if (o === null) {
      throw new Error("Parameter is null");
    } else if (o === undefined) {
      throw new Error("Parameter is undefined");
    } else if (typeof o === "string" && o === "") {
      throw new Error("Given string parameter is empty");
    }
  });
};

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
export const isEmptyString = (str: string | undefined | null) =>
  str === null || str === undefined || str === "";

export const convertToDate = (date: number) =>
  moment.unix(date).toLocaleString();

/** Gets the current time (of user's browser) in unix format. */
const getCurrentTime = () => (
  (new Date()).getTime() / 1000
)

/** 
 * Checks if current time (from the browser's perspective) has passed `expectedTime`.
 * @returns `true` if `expectedTime` has passed.
 */
const isExpired = (expectedTime: number) => expectedTime < getCurrentTime();

/** 
 * Determines whether status should be displayed as `EXPIRED`. 
 * @returns `true` if `expectedTime` has passed and `status` is `OPEN`.
 */
export const shouldShowExpired = (expectedTime: number, status: Status) => (
  isExpired(expectedTime) && status === Status.OPEN
)

export const sortByReverseOrder = (prev: number, curr: number) => (
  prev - curr
)
