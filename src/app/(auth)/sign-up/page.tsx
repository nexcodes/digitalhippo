"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpSchema } from "@/schemas/auth";
import { trpc } from "@/trpc/client";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TAuthCredentialValidator = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(SignUpSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        return toast.error("This email is already in use. Sign in instead!");
      }

      if (err instanceof z.ZodError) {
        return toast.error(err.issues[0].message);
      }

      toast.error("Something went wrong!");
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}`);
      router.push(`/verify-email?to=${sentToEmail}`);
    },
  });

  const onSubmit = (values: TAuthCredentialValidator) => {
    mutate(values);
  };

  return (
    <>
      <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">Create an account</h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-in"
            >
              Already have an account? Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2 space-y-0.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled={isLoading}
                    className={cn({
                      "focus-visible:ring-red-500": !!errors.email,
                    })}
                    placeholder="business@nexcodes.me"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-1 py-2 space-y-0.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    disabled={isLoading}
                    className={cn({
                      "focus-visible:ring-red-500": !!errors.password,
                    })}
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                   {errors?.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <Button disabled={isLoading} type="submit">
                  Sign up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
