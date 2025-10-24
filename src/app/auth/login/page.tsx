// src/app/(auth)/login/page.tsx

'use client';

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import LoginForm from "@/components/forms/LoginForm";

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callbackUrl") || "/";

  const onSubmit = async (data: any) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in!");
      router.push(callback);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6">
      <LoginForm />
    </div>
  );
}

