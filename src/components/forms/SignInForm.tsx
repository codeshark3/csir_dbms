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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignInSchema } from "~/schemas";
import { Form } from "~/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "../CustomFormField";
import { Button } from "../ui/button";

const SignInForm = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    console.log(values);
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              // iconSrc="/assets/icons/email.svg"
              // iconAlt="email"
            />
            <Button type="submit" className="w-full bg-primary">
              Sign In
              {/* <span className="ms-1">🔑</span> */}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
