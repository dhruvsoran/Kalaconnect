
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getProducts, Product } from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function ArtisanDashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Total Revenue</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <div className="text-4xl font-bold">₹45,231.89</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +20.1% from last month
                </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Sales</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <div className="text-4xl font-bold">+12,234</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +19% from last month
                </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" />New Customers</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <div className="text-4xl font-bold">+235</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +180.1% from last month
                </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Profile Views</DialogTitle>
            </DialogHeader>
             <div className="mt-4">
                <div className="text-4xl font-bold">+573</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +201 since last hour
                </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Recent sales from your store.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className="hidden xl:table-column">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Sale</TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-23
                  </TableCell>
                  <TableCell className="text-right">₹250.00</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Priya Sharma</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      priya@example.com
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Sale</TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-25
                  </TableCell>
                  <TableCell className="text-right">₹1250.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
             <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  New Trend Alert!
                </p>
                <p className="text-sm text-muted-foreground">
                  Consider creating products with 'Terracotta' colors.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Pricing Opportunity
                </p>
                <p className="text-sm text-muted-foreground">
                  Your 'Madhubani Painting' could be priced 15% higher.
                </p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Marketing Tip
                </p>
                <p className="text-sm text-muted-foreground">
                  Create a social media post about your 'Warli Art Coasters'.
                </p>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/marketing">Generate</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setProducts(allProducts.filter(p => p.status === 'Active'));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Welcome Back!</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Based on your interests, you might like these unique items.</CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
           ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <Card key={product.name} className="overflow-hidden flex flex-col animate-fade-in group">
                  <CardHeader className="p-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={product.aiHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="font-bold text-lg font-headline">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardContent className="p-4 pt-0 flex justify-between items-center">
                    <p className="font-semibold text-lg">{product.price}</p>
                    <Button size="sm">Add to Cart</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No recommended products at this time. <Link href="/explore" className="text-primary underline">Start exploring</Link>!</p>
          )}
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <Button asChild>
            <Link href="/explore">Explore All Products</Link>
        </Button>
      </div>
    </>
  );
}

export default function Dashboard() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole');
            setUserRole(role);
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <Skeleton className="h-screen w-full" />;
    }
    
    return userRole === 'artisan' ? <ArtisanDashboard /> : <BuyerDashboard />;
}
