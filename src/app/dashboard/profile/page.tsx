
"use client";

import { useEffect, useState } from "react";
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

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    location: z.string().min(2, "Location is required."),
    story: z.string().min(10, "Your story should be at least 10 characters."),
    heritage: z.string().min(10, "Cultural heritage should be at least 10 characters.")
});


export default function ProfilePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<Profile>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            location: "",
            story: "",
            heritage: "",
        },
    });
    
    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true);
                const profileData = await getProfile();
                form.reset(profileData);
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
    }, [form, toast]);


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

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">My Profile</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Story</CardTitle>
                    <CardDescription>
                        This information helps customers connect with you and your craft.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSaveChanges)} className="grid gap-6">
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


function ProfileSkeleton() {
    return (
        <div className="grid gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">My Profile</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Story</CardTitle>
                    <CardDescription>
                        This information helps customers connect with you and your craft.
                    </CardDescription>
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
                    <div className="grid gap-2">
                        <Label>Your Story / Bio</Label>
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Cultural Heritage</Label>
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Button className="w-fit" disabled>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    )
}

    