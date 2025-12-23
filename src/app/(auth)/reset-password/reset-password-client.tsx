"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/validation/auth-schemas";
import { authApi } from "@/lib/auth-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "success" | "error";

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams],
  );

  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setServerError("Missing reset token. Please use the link from your email.");
      return;
    }
  }, [token]);

  const onSubmit = async (values: ResetPasswordSchema) => {
    setServerError(null);

    if (!token) {
      setStatus("error");
      setServerError("Missing reset token. Please use the link from your email.");
      return;
    }

    try {
      await authApi.resetPassword({
        token,
        newPassword: values.newPassword,
      });

      setStatus("success");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Password reset failed. The link may be invalid or expired.";
      setStatus("error");
      setServerError(Array.isArray(msg) ? msg.join(", ") : String(msg));
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-md w-full rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-3">
        <h1 className="text-xl font-semibold">Password reset</h1>
        <p className="text-sm text-emerald-400">
          Password updated successfully. Redirecting to login…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full rounded-xl border border-slate-800 bg-slate-900/60 p-8 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-slate-400">
          Enter a new password for your account.
        </p>
      </div>

      {serverError && (
        <p className="text-xs text-red-400">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-400 mt-1">
              {errors.newPassword.message}
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
