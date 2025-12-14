"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/auth-api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    setServerError(null);

    try {
      await authApi.forgotPassword(values);
      setSuccess(true);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <Card className="border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-2">Forgot password</h1>
      <p className="text-sm text-slate-400 mb-6">
        Enter your email to receive a password reset link.
      </p>

      {success ? (
        <p className="text-sm text-emerald-400">
          If an account with this email exists, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-red-400">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}
    </Card>
  );
}
