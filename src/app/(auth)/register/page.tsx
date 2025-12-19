"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PageShell } from "@/components/page-shell";
import { AuthCard } from "@/components/auth/auth-card";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    setServerError(null);

    try {
      const tokens = await authApi.register({
        email: values.email,
        name: values.name || undefined,
        password: values.password,
      });

      setAuth({ tokens, user: null });
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Registration failed. Please try again.";
      setServerError(Array.isArray(message) ? message.join(", ") : String(message));
    }
  };

  return (
    <PageShell>
      <AuthCard title="Create account" subtitle="Sign up to start using VaultID.">
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
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Name (optional)
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="confirmPassword"
              className="text-sm text-muted-foreground"
            >
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && <p className="text-xs text-red-400">{serverError}</p>}

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-5">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      </AuthCard>
    </PageShell>
  );
}
