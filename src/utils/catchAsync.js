import { toastError } from "./toastWrapper";

export const catchAsync = (fn) => {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      console.log(error);
      toastError("Someting went wrong");
    }
  };
};
