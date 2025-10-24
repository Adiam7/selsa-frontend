// src/lib/auth/credentialsProvider.ts

import CredentialsProvider from "next-auth/providers/credentials";
import { AuthResponse } from "@/types/user";

export const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials) return null;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data: AuthResponse = await res.json();

      return {
        ...data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err) {
      console.error("Login error:", err);
      return null;
    }
  },
});
