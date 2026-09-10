"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { loginSchema, LoginSchemaType } from "@/lib/validations/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

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
      router.push("/organizations");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xl backdrop-blur-xl transition-colors duration-300 rounded-[12px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome Back</CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
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
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-lg shadow-[#ff4f00]/25 cursor-pointer active:scale-95 transition-all"
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

          <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#ff4f00] hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}