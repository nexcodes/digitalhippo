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
import { SignInSchema } from "@/schemas/auth";
import { trpc } from "@/trpc/client";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type TAuthCredentialValidator = z.infer<typeof SignInSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(SignInSchema),
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const { mutate: SignIn, isLoading } = trpc.auth.signIn.useMutation({
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        return toast.error("Invalid email or password");
      }

      console.log(err , "ERROR")

      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      toast.success("Signed in successfully!");
      router.refresh();

      if (origin) {
        return router.push(`/${origin}`);
      }
      if (isSeller) {
        return router.push("/sell");
      }

      router.push("/");
    },
  });

  const onSubmit = (values: TAuthCredentialValidator) => {
    SignIn(values);
  };

  return (
    <>
      <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">Sign in to your {isSeller && "seller"} account</h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-up"
            >
              {"Don't have an account?"}
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
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button disabled={isLoading} type="submit">
                  Sign in
                </Button>
              </div>
            </form>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {isSeller ? (
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => router.push("/sign-in", undefined)}
              >
                Continue as buyer
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => router.push("?as=seller")}
              >
                Continue as seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
