"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/page-shell";
import { AuthCard } from "@/components/auth/auth-card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setServerError("Missing reset token. Please use the link from your email.");
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    setServerError(null);
    setSuccess(null);

    try {
      await authApi.resetPassword({
        token,
        newPassword: values.newPassword,
      });

      setSuccess("Password updated. You can now sign in.");
      reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Reset failed. Please request a new reset link.";
      setServerError(Array.isArray(message) ? message.join(", ") : String(message));
    }
  };

  return (
    <PageShell>
      <AuthCard
        title="Reset password"
        subtitle="Set a new password for your account."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="newPassword" className="text-sm text-muted-foreground">
              New password
            </Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register("newPassword")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={!token}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-400 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="confirmPassword"
              className="text-sm text-muted-foreground"
            >
              Confirm new password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="h-11 bg-background/40 border-input focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={!token}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && <p className="text-xs text-red-400">{serverError}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}

          <Button
            type="submit"
            className="w-full h-11"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? "Updating..." : "Update password"}
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
            onClick={() => router.push("/forgot-password")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Request new link
          </button>
        </div>
      </AuthCard>
    </PageShell>
  );
}
