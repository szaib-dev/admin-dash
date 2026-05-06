import { isAxiosError } from "axios";
import { z } from "zod";

type ApiErrorItem = {
  err?: string;
  errStatus?: number;
  location?: string;
  path?: string;
};

type ApiErrorResponse = ApiErrorItem[] | { message?: string };

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});

export const registerSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});

export const getRequestErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;

    if (Array.isArray(responseData) && responseData.length > 0) {
      return (
        responseData.find((item) => item?.err?.trim())?.err ??
        "Something went wrong. Please try again."
      );
    }

    return (
      responseData?.message ??
      error.message ??
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
