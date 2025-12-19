"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PageShell } from "@/components/page-shell";
import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    setServerError(null);
    setSuccess(null);

    try {
      await authApi.forgotPassword(values);
      setSuccess("If this email exists, a reset link has been sent.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Request failed. Please try again.";
      setServerError(Array.isArray(message) ? message.join(", ") : String(message));
    }
  };

  return (
    <PageShell>
      <AuthCard
        title="Forgot password"
        subtitle="We’ll send you a reset link if the email exists."
      >
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

          {serverError && <p className="text-xs text-red-400">{serverError}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xs text-primary hover:underline"
          >
            Back to login
          </button>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Create account
          </button>
        </div>
      </AuthCard>
    </PageShell>
  );
}
