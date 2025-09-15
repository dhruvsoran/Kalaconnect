
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cardCvc: z.string().length(3, "CVC must be 3 digits"),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
        name: "",
        address: "",
        city: "",
        pincode: "",
        cardName: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
    },
  });

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log("Simulating payment with:", values);
    toast({
      title: "Payment Successful!",
      description: "Your order is being processed.",
    });
    localStorage.removeItem('cart');
    router.push("/order-confirmation");
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-start">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Checkout</CardTitle>
                <CardDescription>Please enter your shipping and payment details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                         <section>
                            <h2 className="text-xl font-semibold mb-4 font-headline">Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Your Name" /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="address" render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="Street Address" /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} placeholder="Your City" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="pincode" render={({ field }) => (
                                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} placeholder="e.g. 110001" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 font-headline">Payment Details (Simulation)</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <FormField control={form.control} name="cardName" render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} placeholder="Name as it appears on your card" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Card Number</FormLabel><FormControl><Input {...field} placeholder="0000 0000 0000 0000" /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="cardCvc" render={({ field }) => (
                                    <FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="123" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </section>
                        
                        <Button type="submit" size="lg" className="w-full">
                            Place Order (Simulated)
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </main>
  );
}
