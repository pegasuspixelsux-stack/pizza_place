"use server";

import { redirect } from "next/navigation";
import { verifyCredentials } from "@/lib/auth/credentials";
import { createSession } from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter your username and password." };
  }

  let isValid: boolean;
  try {
    isValid = await verifyCredentials(username, password);
  } catch (error) {
    console.error("[admin login] credential check failed:", error);
    return {
      error:
        "Admin login isn't configured yet. Set ADMIN_USERNAME, ADMIN_PASSWORD_HASH, and SESSION_SECRET.",
    };
  }

  if (!isValid) {
    return { error: "Incorrect username or password." };
  }

  await createSession(username);
  redirect("/admin");
}
