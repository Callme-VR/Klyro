"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { setToken } from "@/lib/token";
import { loginSchema, LoginSchemaType } from "@/lib/validations/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      setToken(token);
      toast.success("Signed in with Google successfully!");
      window.location.href = "/organizations";
    } else if (error) {
      toast.error(`Authentication failed: ${error}`);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login(data);
      toast.success("Signed in successfully!");
      window.location.href = "/organizations";
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xl backdrop-blur-xl transition-colors duration-300 rounded-[12px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome Back</CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <a
          href={`${API_URL}/auth/google`}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-[12px] border border-zinc-300 dark:border-zinc-700 font-medium transition-colors shadow-sm text-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </a>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
          <span className="bg-[#fffefb] dark:bg-zinc-900 px-2 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold absolute">
            Or continue with email
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
            <Input
              type="email"
              placeholder="alex@example.com"
              {...register("email")}
              className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm rounded-[6px] focus-visible:border-[#ff4f00]"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              {...register("password")}
              className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm rounded-[6px] focus-visible:border-[#ff4f00]"
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-lg shadow-[#ff4f00]/25 cursor-pointer active:scale-95 transition-all mt-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4 text-white" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-0 pb-6">
        <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#ff4f00] hover:underline font-semibold">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}