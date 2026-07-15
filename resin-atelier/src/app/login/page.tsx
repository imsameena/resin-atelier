"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    const res = await signIn("credentials", { ...values, redirect: false });
    setSubmitting(false);

    if (res?.error) {
      toast.error(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
      return;
    }
    toast.success("Welcome back!");
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="container-atelier flex min-h-[70vh] items-center justify-center py-16">
      <div className="card-atelier w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-ink-500">Sign in to track orders and check out faster.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="label-atelier">Email</label>
            <input type="email" className="input-atelier" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label-atelier">Password</label>
            <input type="password" className="input-atelier" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-2 justify-center">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          New here?{" "}
          <Link href="/register" className="font-medium text-blush-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
