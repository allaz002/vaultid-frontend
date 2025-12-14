"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setServerError(null);

    try {
      const tokens = await authApi.login(values);

      setAuth({ tokens, user: null });

      router.push("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Login failed. Please check your credentials.";
      setServerError(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    }
  };

  return (
    <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-1">Login</h1>
      <p className="text-sm text-slate-400 mb-6">
        Sign in to your VaultID account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-xs text-red-400 mt-1">{serverError}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-xs text-slate-500 mt-4">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-emerald-400 hover:underline"
        >
          Create one
        </button>
      </p>
    </Card>
  );
}
