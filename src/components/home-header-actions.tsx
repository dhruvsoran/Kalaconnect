
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

export function HomeHeaderActions() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // This code runs only on the client
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
        setIsLoading(false);

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };
        
        updateCartCount();

        window.addEventListener('storage', updateCartCount); // Listen for changes from other tabs
        window.addEventListener('cartUpdated', updateCartCount); // Custom event

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };

    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        // Optionally, clear the cart on logout
        // localStorage.removeItem('cart');
        // window.dispatchEvent(new Event('cartUpdated'));
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
            </div>
        );
    }

    if (isLoggedIn) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                     <Link href="/cart" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
                        )}
                    </Link>
                </Button>
                <div className="hidden sm:flex items-center gap-2">
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
                    )}
                </Link>
            </Button>
            <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                    <Link href="/register">Sign Up</Link>
                </Button>
            </div>
        </div>
    );
}
