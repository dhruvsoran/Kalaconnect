
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Bot,
  BarChart,
  Brush,
  User,
  ShoppingCart,
  Heart,
  Camera,
  ListOrdered,
} from 'lucide-react';
import { KalaConnectIcon } from '@/components/icons';
import { UserMenu } from '@/components/user-menu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole');
            setUserRole(role);
        }
    }, []);


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline transition-colors active:text-accent active:animate-pop">
              <KalaConnectIcon className="h-6 w-6 text-primary" />
              <span>KalaConnect</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {userRole === 'artisan' ? (
                <>
                    <NavItem icon={<LayoutDashboard className="h-4 w-4" />} href="/dashboard">
                        Dashboard
                    </NavItem>
                    <NavItem icon={<Package className="h-4 w-4" />} href="/dashboard/products">
                        Products
                    </NavItem>
                     <NavItem icon={<Camera className="h-4 w-4" />} href="/dashboard/visualizer">
                        AI Visualizer
                    </NavItem>
                    <NavItem icon={<Brush className="h-4 w-4" />} href="/dashboard/marketing">
                        Marketing
                    </NavItem>
                    <NavItem icon={<BarChart className="h-4 w-4" />} href="/dashboard/analytics">
                        Analytics
                    </NavItem>
                    <NavItem icon={<Bot className="h-4 w-4" />} href="/dashboard/chatbot">
                        Chatbot
                    </NavItem>
                    <NavItem icon={<User className="h-4 w-4" />} href="/dashboard/profile">
                        Profile
                    </NavItem>
                </>
              ) : (
                 <>
                    <NavItem icon={<LayoutDashboard className="h-4 w-4" />} href="/dashboard">
                        Dashboard
                    </NavItem>
                     <NavItem icon={<Package className="h-4 w-4" />} href="/explore">
                        Explore Products
                    </NavItem>
                    <NavItem icon={<ShoppingCart className="h-4 w-4" />} href="/cart">
                        My Cart
                    </NavItem>
                     <NavItem icon={<Heart className="h-4 w-4" />} href="/wishlist">
                        Wishlist
                    </NavItem>
                     <NavItem icon={<ListOrdered className="h-4 w-4" />} href="/dashboard/orders">
                        My Orders
                    </NavItem>
                     <NavItem icon={<User className="h-4 w-4" />} href="/dashboard/profile">
                        Profile
                    </NavItem>
                 </>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Nav Trigger can go here */}
          <div className="w-full flex-1" />
          <UserMenu />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`}
        >
            {icon}
            {children}
        </Link>
    );
}
