
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, Product } from '@/lib/db';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [wishlist, setWishlist] = useState<Product[]>([]);

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(storedWishlist);

        const handleWishlistUpdate = () => {
             const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
             setWishlist(updatedWishlist);
        }
        window.addEventListener('wishlistUpdated', handleWishlistUpdate);

        return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    }, []);
    
    const isProductInWishlist = wishlist.some((item: Product) => item.name === product.name);

    const handleAuthAction = (callback: () => void) => {
         if (!isLoggedIn) {
            toast({
                variant: "destructive",
                title: "Authentication Required",
                description: "Please log in to perform this action.",
                action: (
                    <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                        Login
                    </Button>
                ),
            });
            return;
        }
        callback();
    }

    const handleAddToCart = () => {
        handleAuthAction(() => {
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
        });
    };

    const handleWishlistToggle = () => {
        handleAuthAction(() => {
            let newWishlist = [...wishlist];
            if (isProductInWishlist) {
                newWishlist = newWishlist.filter(item => item.name !== product.name);
                 toast({
                    title: "Removed from Wishlist",
                    description: `${product.name} has been removed from your wishlist.`,
                });
            } else {
                newWishlist.push(product);
                 toast({
                    title: "Added to Wishlist!",
                    description: `${product.name} has been added to your wishlist.`,
                });
            }
            setWishlist(newWishlist);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            window.dispatchEvent(new Event('wishlistUpdated'));
        });
    }

    return (
        <Card className="overflow-hidden flex flex-col animate-fade-in group">
            <CardHeader className="p-0 relative">
                 <Button size="icon" variant="ghost" className="absolute top-2 right-2 z-10 bg-white/50 backdrop-blur-sm rounded-full" onClick={handleWishlistToggle}>
                    <Heart className={cn("h-5 w-5", isProductInWishlist ? "fill-red-500 text-red-500" : "text-gray-500")} />
                </Button>
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
                <Button size="sm" onClick={handleAddToCart}><ShoppingCart className="mr-2 h-4 w-4" />Add to Cart</Button>
            </CardFooter>
        </Card>
    )
}
