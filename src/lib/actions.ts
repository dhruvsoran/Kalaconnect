
"use server";

import { generateProductDescription, GenerateProductDescriptionInput } from "@/ai/flows/generate-product-descriptions";
import { createMarketingContent, CreateMarketingContentInput } from "@/ai/flows/create-marketing-content";
import { getChatbotAssistance, GetChatbotAssistanceInput } from "@/ai/flows/get-chatbot-assistance";
import { addProduct, Profile, Product, saveProfile as saveProfileDb } from "@/lib/db";
import { VisualizeProductInRoomInput, visualizeProductInRoom } from "@/ai/flows/visualize-product-in-room";

type GenerateProductDescriptionActionInput = Omit<GenerateProductDescriptionInput, "productImageUri"> & {
    productImageUri: string;
};

export async function generateProductDescriptionAction(input: GenerateProductDescriptionActionInput) {
    try {
        const result = await generateProductDescription(input);
        return { productDescription: result.productDescription };
    } catch (error) {
        console.error("Error in generateProductDescriptionAction:", error);
        return { error: "Failed to generate description. Please check the server logs." };
    }
}

export async function createMarketingContentAction(input: CreateMarketingContentInput) {
    try {
        const result = await createMarketingContent(input);
        return { socialMediaPost: result.socialMediaPost, emailCampaign: result.emailCampaign };
    } catch (error) {
        console.error("Error in createMarketingContentAction:", error);
        return { error: "Failed to generate marketing content. Please check the server logs." };
    }
}


export async function getChatbotAssistanceAction(input: GetChatbotAssistanceInput) {
    try {
        const result = await getChatbotAssistance(input);
        return { response: result.response };
    } catch (error) {
        console.error("Error in getChatbotAssistanceAction:", error);
        return { error: "Sorry, I am having trouble connecting. Please try again later." };
    }
}

export async function saveProductAction(productData: {
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    aiHint: string;
}) {
    try {
        const newProduct: Omit<Product, 'date'> = {
            ...productData,
            status: 'Draft',
        };
        const savedProduct = await addProduct(newProduct);
        return { success: true, product: savedProduct };
    } catch (error) {
        console.error("Error in saveProductAction:", error);
        return { error: "Failed to save the product." };
    }
}

export async function saveProfileAction(profileData: Profile) {
    try {
        const updatedProfile = await saveProfileDb(profileData);
        return { success: true, profile: updatedProfile };
    } catch (error) {
        console.error("Error in saveProfileAction:", error);
        return { error: "Failed to save profile." };
    }
}

export async function visualizeProductInRoomAction(input: VisualizeProductInRoomInput) {
    try {
        const result = await visualizeProductInRoom(input);
        return { generatedImageUri: result.generatedImageUri };
    } catch (error) {
        console.error("Error in visualizeProductInRoomAction:", error);
        return { error: "Failed to generate visualization. Please try again." };
    }
}

    