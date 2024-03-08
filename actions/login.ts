"use server";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
          break;
        default:
          return { error: "something went wrong" };
      }
    }
    // if (error instanceof Error) {
    //   const { type, cause } = error as AuthError;
    //   switch (type) {
    //     case "CredentialsSignin":
    //       return "Invalid credentials.";
    //     case "CallbackRouteError":
    //       return cause?.err?.toString();
    //     default:
    //       return "Something went wrong.";
    //   }
    // }
    throw error;
    return { error: "Something went wrong" };
  }
  return { success: "Email sent" };
};
