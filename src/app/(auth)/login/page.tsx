"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PageShell } from "@/components/page-shell";
import { AuthCard } from "@/components/auth/auth-card";

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
      setServerError(Array.isArray(message) ? message.join(", ") : String(message));
    }
  };

  return (
    <PageShell>
      <AuthCard title="Login" subtitle="Sign in to your VaultID account.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-xs text-red-400">{serverError}</p>}

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-xs text-primary hover:underline"
        >
          Forgot password?
        </button>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
      </AuthCard>
    </PageShell>
  );
}
