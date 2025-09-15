
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, Product } from '@/lib/db';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ExplorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        async function fetchProducts() {
            const allProducts = await getProducts();
            setProducts(allProducts.filter(p => p.status === 'Active'));
        }
        fetchProducts();
    }, []);
    

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline animate-fade-in-down">Explore Our Marketplace</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground animate-fade-in-up">
                    Discover unique, handcrafted items directly from Indian artisans.
                </p>
            </div>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                       <ProductCard key={product.name} product={product} />
                    ))}
                </div>
            ) : (
                <Card className="m-4">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Marketplace Coming Soon</CardTitle>
                        <CardDescription>
                            Our artisans are busy creating! Check back soon to see their beautiful products.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild className="mt-4">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}


function ProductCard({ product }: { product: Product }) {
    const { toast } = useToast();

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const isProductInCart = cart.some((item: Product) => item.name === product.name);

        if (isProductInCart) {
             toast({
                variant: "destructive",
                title: "Already in Cart",
                description: `${product.name} is already in your shopping cart.`,
            });
            return;
        }

        const newCart = [...cart, product];
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));

        toast({
            title: "Added to Cart!",
            description: `Successfully added ${product.name} to your cart.`,
            action: (
                <Button variant="outline" size="sm" asChild>
                    <Link href="/cart">View Cart</Link>
                </Button>
            ),
        });
    };

    return (
        <Card className="overflow-hidden flex flex-col animate-fade-in group">
            <CardHeader className="p-0">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={product.aiHint}
                />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <h3 className="font-bold text-lg font-headline">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                 <p className="font-semibold text-lg">{product.price}</p>
                <Button size="sm" onClick={handleAddToCart}>Add to Cart</Button>
            </CardFooter>
        </Card>
    )
}
