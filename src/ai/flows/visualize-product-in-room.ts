
'use server';

/**
 * @fileOverview AI-powered product visualizer.
 *
 * - visualizeProductInRoom - A function that places a product image into a room image.
 * - VisualizeProductInRoomInput - The input type for the function.
 * - VisualizeProductInRoomOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisualizeProductInRoomInputSchema = z.object({
  productImageUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  roomImageUri: z
    .string()
    .describe(
      "A photo of the user's room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VisualizeProductInRoomInput = z.infer<typeof VisualizeProductInRoomInputSchema>;

const VisualizeProductInRoomOutputSchema = z.object({
  generatedImageUri: z.string().describe('The generated image of the product in the room as a data URI.'),
});
export type VisualizeProductInRoomOutput = z.infer<typeof VisualizeProductInRoomOutputSchema>;

export async function visualizeProductInRoom(
  input: VisualizeProductInRoomInput
): Promise<VisualizeProductInRoomOutput> {
  return visualizeProductInRoomFlow(input);
}

const visualizeProductInRoomFlow = ai.defineFlow(
  {
    name: 'visualizeProductInRoomFlow',
    inputSchema: VisualizeProductInRoomInputSchema,
    outputSchema: VisualizeProductInRoomOutputSchema,
  },
  async ({ productImageUri, roomImageUri }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: [
        { media: { url: productImageUri } },
        { media: { url: roomImageUri } },
        { text: 'Place the product from the first image into the room from the second image. The product should be placed in a natural and realistic position. Maintain the original art style of both the product and the room. Do not add any extra objects. Generate only the image, no text.' },
      ],
      output: {
        format: 'image',
      }
    });

    const generatedImage = output.media;

    if (!generatedImage?.url) {
      throw new Error('Image generation failed to produce an output.');
    }
    
    return {
      generatedImageUri: generatedImage.url,
    };
  }
);
