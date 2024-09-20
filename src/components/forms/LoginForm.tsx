"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/lib/utils";
import { signIn } from "@/server/actions/auth.actions";
import { type AuthSignInParams } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    const signInParams: AuthSignInParams = {
      email: data.email,
      password: data.password,
    };
    const result = await signIn(signInParams);
    if (result.success) {
      router.push("/");
    } else {
      toast.error(result.error ?? "Login failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <h1>Finance Tracker</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-1 md:gap-2">
              <h2>Login</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          <footer className="mt-6 flex justify-center gap-1">
            <p className="text-14 text-secondary-foreground">
              Don&apos;t have an account?
            </p>
            <Link href="/sign-up" className="form-link">
              Sign Up
            </Link>
          </footer>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginForm;
