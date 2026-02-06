"use client";
import { Link, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import React, { useState, useActionState, useTransition, useEffect } from "react";
import CountryCodeSelect from "../common/CountryCodeSelect";
import { login, signup } from "@/data/customer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass1, setShowRegPass1] = useState(false);
  const [showRegPass2, setShowRegPass2] = useState(false);
  const [countryCode, setCountryCode] = useState("+86");
  const [isPending, startTransition] = useTransition();

  const [loginState, loginAction] = useActionState(login, null);
  const [registerState, registerAction] = useActionState(signup, null);

  // 老王我：登录成功后跳转到 returnUrl
  useEffect(() => {
    if (loginState && !loginState.error && returnUrl) {
      // 安全验证：确保 returnUrl 是内部 URL
      try {
        const url = new URL(returnUrl, window.location.origin);
        if (url.origin === window.location.origin) {
          router.push(returnUrl);
        } else {
          // 如果是外部 URL，跳转到首页
          router.push('/');
        }
      } catch {
        // URL 解析失败，跳转到首页
        router.push('/');
      }
    }
  }, [loginState, returnUrl, router]);

  // 老王我：注册成功后也跳转到 returnUrl
  useEffect(() => {
    if (registerState && !registerState.error && returnUrl) {
      try {
        const url = new URL(returnUrl, window.location.origin);
        if (url.origin === window.location.origin) {
          router.push(returnUrl);
        } else {
          router.push('/');
        }
      } catch {
        router.push('/');
      }
    }
  }, [registerState, returnUrl, router]);

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 老王我：添加 returnUrl 到 formData
    if (returnUrl) {
      formData.append('returnUrl', returnUrl);
    }

    startTransition(() => {
      loginAction(formData);
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    formData.set("phone", `${countryCode}${formData.get("phone_number")}`);

    startTransition(() => {
      registerAction(formData);
    });
  };

  return (
    <section className="min-h-screen flex items-start justify-center bg-gray-50/50 pt-20 pb-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in the form to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs
              value={isLogin ? "login" : "register"}
              onValueChange={(value) => setIsLogin(value === "login")}
              className="w-full"
              suppressHydrationWarning
            >
              <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-gray-100/80">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-sm font-medium"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-sm font-medium"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-8">
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="h-11 border-gray-200 focus-visible:ring-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showLoginPass ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="h-11 border-gray-200 pr-10 focus-visible:ring-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showLoginPass ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="border-gray-300" />
                      <label
                        htmlFor="remember"
                        className="text-gray-600 cursor-pointer select-none"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link href="/reset-password" className="text-gray-900 hover:underline font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  {loginState?.error && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                      {loginState.error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 font-medium text-base"
                    disabled={isPending}
                  >
                    {isPending ? "Loading..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-8">
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="first-name"
                        name="first_name"
                        type="text"
                        placeholder="John"
                        required
                        className="h-11 border-gray-200 focus-visible:ring-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        name="last_name"
                        type="text"
                        placeholder="Doe"
                        required
                        className="h-11 border-gray-200 focus-visible:ring-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="h-11 border-gray-200 focus-visible:ring-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="flex gap-3">
                      <CountryCodeSelect onSelect={setCountryCode} initialCode="+86" />
                      <Input
                        id="phone"
                        name="phone_number"
                        type="tel"
                        placeholder="1234567890"
                        required
                        className="flex-1 h-11 border-gray-200 focus-visible:ring-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showRegPass1 ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="h-11 border-gray-200 pr-10 focus-visible:ring-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass1(!showRegPass1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showRegPass1 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showRegPass2 ? "text" : "password"}
                        placeholder="Confirm your password"
                        required
                        className="h-11 border-gray-200 pr-10 focus-visible:ring-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass2(!showRegPass2)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showRegPass2 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {registerState?.error && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                      {registerState.error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 font-medium text-base"
                    disabled={isPending}
                  >
                    {isPending ? "Loading..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
