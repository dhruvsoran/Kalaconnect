
"use client";

import Link from "next/link";
import { KalaConnectIcon } from "@/components/icons";
import { HomeHeaderActions } from "@/components/home-header-actions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        )}>
            <div className="container flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-headline transition-colors active:text-accent active:animate-pop">
                    <KalaConnectIcon className="h-8 w-8 text-primary" />
                    KalaConnect
                </Link>
                <nav className="hidden md:flex gap-6">
                    <Link href="/#features" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                    Features
                    </Link>
                    <Link href="/#about" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                    About
                    </Link>
                    <Link href="/explore" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                    Explore
                    </Link>
                </nav>
                <HomeHeaderActions />
            </div>
        </header>
    );
}
