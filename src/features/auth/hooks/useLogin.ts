// features/auth/hooks/useLogin.ts

import { useState } from "react";
import { loginApi, LoginPayload } from "@/types/login";
import { useRouter } from "next/navigation";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function login(payload: LoginPayload) {
    setLoading(true);
    setError(null);
    try {
      const { user, accessToken, refreshToken } = await loginApi(payload);

      // Store tokens securely
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // (Optional) Store user data globally
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to dashboard or home
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading,
    error,
  };
}
