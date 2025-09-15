
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KalaConnectIcon } from "@/components/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveProfileAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const registerSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    role: z.enum(["buyer", "artisan"]),
});


function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const initialRole = searchParams.get('role') === 'artisan' ? 'artisan' : 'buyer';
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: initialRole,
    },
  });
  
   useEffect(() => {
    form.setValue('role', initialRole);
  }, [initialRole, form]);


  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    
    // In a real app, you would save the user to Firebase Auth here.
    // For this prototype, we'll just save the profile info for artisans.
    if (values.role === 'artisan') {
        try {
            await saveProfileAction({
                name: values.fullName,
                location: "", // These would be part of a more detailed onboarding
                story: "",
                heritage: "",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Could not save artisan profile. Please try again.",
            });
            return;
        }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', values.role);
    }
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-headline transition-colors active:text-accent active:animate-pop">
              <KalaConnectIcon className="h-8 w-8 text-primary" />
              KalaConnect
            </Link>
          </div>
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Join as an artisan or a buyer to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="grid gap-4">
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>I want to join as a...</FormLabel>
                   <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                             <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                          </FormControl>
                          <Label
                              htmlFor="buyer"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full"
                          >
                              Buyer
                          </Label>
                        </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="artisan" id="artisan" className="peer sr-only" />
                          </FormControl>
                           <Label
                              htmlFor="artisan"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full"
                          >
                              Artisan
                          </Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel>Full name</FormLabel><FormControl><Input placeholder="Ravi Kumar" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating Account..." : "Create an account"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
