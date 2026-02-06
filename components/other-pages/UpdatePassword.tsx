"use client";
import React, { useState, useActionState } from "react";
import { updatePassword } from "@/data/customer";
import { useSearchParams } from "next/navigation";
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2, ArrowLeft, XCircle } from "lucide-react";

export default function UpdatePassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [state, formAction, isPending] = useActionState(updatePassword, null) as [
    { success: boolean; error?: string } | null,
    (payload: FormData) => void,
    boolean
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    const formData = new FormData(e.currentTarget);
    React.startTransition(() => {
      formAction(formData);
    });
  };

  // 老王我显示无效链接的错误页面
  if (!token || !email) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Invalid Link
              </CardTitle>
              <CardDescription className="text-base">
                The password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Please request a new password reset link or contact support if you continue to have problems.
                </p>
                <Link href="/login" className="block">
                  <Button className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 font-medium text-base">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-gray-700" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Update Password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="email" value={email} />

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPass1 ? "text" : "password"}
                    placeholder="Enter your new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-gray-200 pr-10 focus-visible:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass1(!showPass1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass1 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPass2 ? "text" : "password"}
                    placeholder="Confirm your new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordMismatch(false);
                    }}
                    className="h-11 border-gray-200 pr-10 focus-visible:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass2(!showPass2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass2 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {passwordMismatch && (
                <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>Passwords do not match</p>
                  </div>
                </div>
              )}

              {state?.error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{state.error}</p>
                  </div>
                </div>
              )}

              {state?.success && (
                <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>Password updated successfully! Redirecting to login...</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 font-medium text-base"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Password"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}