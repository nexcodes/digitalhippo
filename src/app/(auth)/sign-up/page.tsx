"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {useForm} from "react-hook-form"
import { SignUpSchema } from "../../../schemas/auth";

type TAuthCredentialValidator = z.infer<typeof SignUpSchema>

export default function SignUpPage() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(SignUpSchema)
  });

  const onSubmit = (values: TAuthCredentialValidator) => {

  }

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
                    className={cn({
                      "focus-visible:ring-red-500": true,
                    })}
                    placeholder="business@nexcodes.me"
                  />
                </div>

                <div className="grid gap-1 py-2 space-y-0.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className={cn({
                      "focus-visible:ring-red-500": true,
                    })}
                    placeholder="Password"
                  />
                </div>

                <Button type="submit">Sign up</Button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
