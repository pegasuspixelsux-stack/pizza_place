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
    return { error: "Ingresá tu usuario y contraseña." };
  }

  let isValid: boolean;
  try {
    isValid = await verifyCredentials(username, password);
  } catch (error) {
    console.error("[admin login] credential check failed:", error);
    return {
      error:
        "El acceso de administración todavía no está configurado. Configurá ADMIN_USERNAME, ADMIN_PASSWORD_HASH y SESSION_SECRET.",
    };
  }

  if (!isValid) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await createSession(username);
  redirect("/admin");
}
