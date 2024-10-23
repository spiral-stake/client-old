import { toastError } from "./toastWrapper";

export const catchAsync = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.log(error);
      toastError(error.message || "Someting went wrong");
    }
  };
};
