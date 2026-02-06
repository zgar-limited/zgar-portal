"use client";
import React, { useState, useActionState } from "react";
import { resetPassword } from "@/data/customer";
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(resetPassword, null) as [
    { success: boolean; message: string } | null,
    (payload: FormData) => void,
    boolean
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-gray-700" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email address to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus-visible:ring-gray-900"
                />
              </div>

              {state?.message && (
                <div className={`rounded-md border p-4 ${
                  state.success
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  <div className="flex items-start gap-3">
                    {state.success ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{state.message}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 font-medium text-base"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send Reset Link"}
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