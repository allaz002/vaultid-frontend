"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/auth-api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <Card className="p-6">
        <p className="text-sm text-red-400">Invalid reset link.</p>
      </Card>
    );
  }

  const onSubmit = async (values: ResetPasswordSchema) => {
    setServerError(null);

    try {
      await authApi.resetPassword({
        token,
        newPassword: values.newPassword,
      });

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "Reset failed. Please try again.",
      );
    }
  };

  return (
    <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-2">Reset password</h1>

      {success ? (
        <p className="text-sm text-emerald-400">
          Password updated. Redirecting to login…
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>New password</Label>
            <Input type="password" {...register("newPassword")} />
            {errors.newPassword && (
              <p className="text-xs text-red-400">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Confirm password</Label>
            <Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-red-400">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      )}
    </Card>
  );
}
