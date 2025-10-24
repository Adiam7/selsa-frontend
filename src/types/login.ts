// selsa-frontend/src/types/login.ts

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    username: string;
    is_email_verified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.detail || "Login failed");
  }

  return res.json();
}
