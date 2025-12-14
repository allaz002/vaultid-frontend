"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema, } from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    setServerError(null);
    setInfoMessage(null);

    try {
      const { confirmPassword, ...payload } = values;
      const authResponse = await authApi.register({
        email: payload.email,
        password: payload.password,
        name: payload.name || undefined,
      });

      // backend returns user + tokens
      setAuth({
        tokens: {
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
        },
        user: authResponse.user ?? null,
      });

      setInfoMessage(
        "Registration successful. Please check your email to verify your account.",
      );

    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Registration failed. Please try again.";
      setServerError(
        Array.isArray(message) ? message.join(", ") : String(message),
      );
    }
  };

  return (
    <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-1">Create account</h1>
      <p className="text-sm text-slate-400 mb-6">
        Sign up to start using VaultID.
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
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-xs text-red-400 mt-1">{serverError}</p>
        )}

        {infoMessage && (
          <p className="text-xs text-emerald-400 mt-1">{infoMessage}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="text-xs text-slate-500 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-emerald-400 hover:underline"
        >
          Sign in
        </button>
      </p>
    </Card>
  );
}
