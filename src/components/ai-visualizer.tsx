
"use client";

import { useState, useEffect }from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Sparkles, Loader2, Wand2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProducts, Product } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { visualizeProductInRoomAction } from "@/lib/actions";

const formSchema = z.object({
    productName: z.string().min(1, "Please select a product."),
    roomImage: z.any().refine(file => file instanceof File, "A photo of your room is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function AiVisualizer() {
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [finalImage, setFinalImage] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [roomPreview, setRoomPreview] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    useEffect(() => {
      async function loadProducts() {
        const prods = await getProducts();
        setProducts(prods.filter(p => p.status === 'Active'));
      }
      loadProducts();
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
        },
    });

    const handleRoomImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setValue("roomImage", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setRoomPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProductChange = (productName: string) => {
        form.setValue("productName", productName);
        const product = products.find(p => p.name === productName);
        setSelectedProduct(product || null);
    };

    async function onSubmit(data: FormValues) {
        if (!roomPreview || !selectedProduct) {
            toast({ variant: "destructive", title: "Missing information", description: "Please select a product and upload a room photo." });
            return;
        }

        setIsVisualizing(true);
        setFinalImage(null);

        try {
            const result = await visualizeProductInRoomAction({
                productImageUri: selectedProduct.image,
                roomImageUri: roomPreview
            });
            if (result.error) throw new Error(result.error);
            setFinalImage(result.generatedImageUri || null);
            toast({ title: "Visualization Ready!", description: "Here's how the product could look in your space." });
        } catch (error) {
            toast({ variant: "destructive", title: "Visualization Failed", description: "Could not generate image. Please try again." });
        } finally {
            setIsVisualizing(false);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid flex-1 auto-rows-max gap-4">
                 <div className="flex items-center gap-4">
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
                        AI Product Visualizer
                    </h1>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>1. Choose Your Item</CardTitle>
                            <CardDescription>Select a product you'd like to see in your room.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                             <FormField control={form.control} name="productName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product</FormLabel>
                                    <Select onValueChange={handleProductChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a product to visualize" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {products.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {selectedProduct && (
                                <div className="flex justify-center p-4 bg-muted rounded-md">
                                    <Image src={selectedProduct.image} alt={selectedProduct.name} width={150} height={150} className="rounded-md object-cover" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>2. Upload Your Room Photo</CardTitle>
                            <CardDescription>Upload a picture of the space where you imagine the product.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <FormField control={form.control} name="roomImage" render={() => (
                                <FormItem>
                                <FormControl>
                                    <div className="grid gap-2">
                                        <label htmlFor="room-image-upload" className="cursor-pointer">
                                        <Image
                                            alt="Your room"
                                            className="aspect-video w-full rounded-md object-cover border-2 border-dashed"
                                            height="200"
                                            src={roomPreview || "https://placehold.co/400x200/e5e5e5/a3a3a3/png?text=Upload+Your+Room+Photo"}
                                            width="400"
                                            data-ai-hint="placeholder"
                                        />
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input id="room-image-upload" type="file" className="sr-only" onChange={handleRoomImageChange} accept="image/*" />
                                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('room-image-upload')?.click()}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Photo
                                            </Button>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
                 <div className="flex justify-center">
                    <Button type="submit" size="lg" disabled={isVisualizing}>
                        {isVisualizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Visualizing...</> : <><Wand2 className="mr-2 h-4 w-4" />Visualize in Your Room</>}
                    </Button>
                </div>

                {isVisualizing && (
                     <Card className="mt-4">
                        <CardHeader><CardTitle>Generating Your Scene...</CardTitle></CardHeader>
                        <CardContent className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                )}

                {finalImage && (
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Your AI-Generated Scene</CardTitle>
                            <CardDescription>Here's how the "{selectedProduct?.name}" might look in your space! </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Image src={finalImage} alt="AI generated image of product in room" width={800} height={600} className="rounded-md w-full object-contain" />
                        </CardContent>
                    </Card>
                )}
            </form>
        </Form>
    )
}
