"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create account");

      const signInRes = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (signInRes?.error) throw new Error(signInRes.error);

      toast.success("Account created! Welcome to Resin Atelier.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-atelier flex min-h-[70vh] items-center justify-center py-16">
      <div className="card-atelier w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Create Your Account</h1>
        <p className="mt-1 text-sm text-ink-500">Save addresses, track orders and check out faster.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="label-atelier">Full Name</label>
            <input className="input-atelier" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label-atelier">Email</label>
            <input type="email" className="input-atelier" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label-atelier">Phone (optional)</label>
            <input className="input-atelier" {...register("phone")} />
          </div>
          <div>
            <label className="label-atelier">Password</label>
            <input type="password" className="input-atelier" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-2 justify-center">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blush-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
