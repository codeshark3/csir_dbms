"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "~/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignUpSchema } from "~/schemas";
import { Form } from "~/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";
import { Button } from "../ui/button";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTransition, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const { name, email, password, confirm_password } = values;
    const { data, error } = await authClient.signUp.email({
      email,
      name,
      password,
      callbackURL: "/sign-in ",
      fetchOptions: {
        onRequest: () => {
          toast({
            // title: { success },
            description: " requesting",
            variant: "default",
            className: "bg-blue-500 text-white font-bold ",
          });
        },
        onSuccess: () => {
          toast({
            // title: { success },
            description: " successfully",
            variant: "default",
            className: "bg-emerald-500 text-white font-bold ",
          });
          form.reset();
          router.push("/sign-in"); // redirect to login page
        },

        onError: () => {
          toast({
            // title: { error },
            description: " failed",
            variant: "default",
            className: "bg-red-500 text-white font-bold ",
          });
        },
      },
    });
    // console.log(values);
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex flex-col items-center justify-center pb-2">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="pb-2"
          />
          <h1 className="text-bold text-xl">CSIR Database Management System</h1>
        </div>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="name"
              label="Name"
              placeholder="John Doe"
              // iconSrc="/assets/icons/email.svg"
              // iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="user@email.com"
              // iconSrc="/assets/icons/email.svg"
              // iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PASSWORD}
              name="password"
              label="Password"
              placeholder="*******"
              type={showPassword ? "text" : "password"}
              endIcon={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              }
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PASSWORD}
              name="confirm_password"
              label="Confirm Password"
              placeholder="*******"
              type={showConfirmPassword ? "text" : "password"}
              endIcon={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              }
            />
            <Button type="submit" className="w-full bg-primary">
              Sign Up
              {/* <span className="ms-1">🔑</span> */}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
