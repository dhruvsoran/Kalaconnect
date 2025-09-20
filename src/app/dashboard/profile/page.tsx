
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getProfile, Profile } from "@/lib/db";
import { saveProfileAction } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const artisanProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    location: z.string().min(2, "Location is required."),
    story: z.string().min(10, "Your story should be at least 10 characters."),
    heritage: z.string().min(10, "Cultural heritage should be at least 10 characters."),
    avatar: z.string().optional(),
});

const buyerProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    location: z.string().min(2, "Location is required."),
    avatar: z.string().optional(),
});


export default function ProfilePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<Profile | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        async function loadProfile() {
            try {
                setIsLoading(true);
                const data = await getProfile();
                setProfileData(data);
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Failed to load profile",
                    description: "Could not fetch your profile data.",
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [toast]);

    if (isLoading) {
        return <ProfileSkeleton isArtisan={userRole === 'artisan'} />;
    }

    if (!profileData) {
        return <div>Failed to load profile.</div>;
    }

    if (userRole === 'artisan') {
        return <ArtisanProfileForm initialData={profileData} />;
    }
    
    return <BuyerProfileForm initialData={profileData} />;
}

function ArtisanProfileForm({ initialData }: { initialData: Profile }) {
    const { toast } = useToast();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<Profile>({
        resolver: zodResolver(artisanProfileSchema),
        defaultValues: initialData,
    });
    
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                form.setValue("avatar", result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = async (data: Profile) => {
        try {
            await saveProfileAction(data);
            toast({
                title: "Profile Saved!",
                description: "Your information has been updated successfully.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Could not save your profile. Please try again.",
            });
        }
    };

    return (
        <div className="grid gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Artisan Profile</h1>
            </div>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveChanges)} className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                             <CardDescription>
                                Upload a photo of yourself or your brand logo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarPreview || undefined} alt={initialData.name} />
                                    <AvatarFallback>{initialData.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Photo
                                </Button>
                                <Input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Story</CardTitle>
                            <CardDescription>
                                This information helps customers connect with you and your craft.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="location" render={({ field }) => (
                                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="story" render={({ field }) => (
                                    <FormItem><FormLabel>Your Story / Bio</FormLabel><FormControl><Textarea className="min-h-32" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="heritage" render={({ field }) => (
                                    <FormItem><FormLabel>Cultural Heritage</FormLabel><FormControl><Textarea className="min-h-24" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

function BuyerProfileForm({ initialData }: { initialData: Profile }) {
    const { toast } = useToast();
    const form = useForm<Profile>({
        resolver: zodResolver(buyerProfileSchema),
        defaultValues: initialData,
    });

     const handleSaveChanges = async (data: Profile) => {
        try {
            // Ensure we don't overwrite artisan-specific fields
            const payload: Profile = {
                ...initialData,
                name: data.name,
                location: data.location,
            };
            await saveProfileAction(payload);
            toast({
                title: "Profile Saved!",
                description: "Your information has been updated successfully.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Could not save your profile. Please try again.",
            });
        }
    };


     return (
        <div className="grid gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">My Profile</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                       Manage your account details and view your status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSaveChanges)} className="grid gap-6">
                             <div className="flex items-center gap-4">
                                <Label>Account Status:</Label>
                                <Badge variant="secondary" className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Verified
                                </Badge>
                             </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="location" render={({ field }) => (
                                    <FormItem><FormLabel>Location / City</FormLabel><FormControl><Input {...field} placeholder="e.g. Mumbai, India"/></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}


function ProfileSkeleton({ isArtisan }: { isArtisan: boolean }) {
    return (
        <div className="grid gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">My Profile</h1>
            </div>
            {isArtisan && (
                 <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-72" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-full max-w-sm" /></CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Location</Label>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                     {isArtisan && (
                        <>
                            <div className="grid gap-2">
                                <Label>Your Story / Bio</Label>
                                <Skeleton className="h-32 w-full" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Cultural Heritage</Label>
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </>
                    )}
                    <Button className="w-fit" disabled>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    )
}
