import { GoogleGenAI, Type } from "@google/genai";
import { TCMRecipe } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const generateRecipeFromIngredients = async (ingredients: string[]): Promise<TCMRecipe> => {
  if (!ingredients || ingredients.length === 0) {
    throw new Error("No se proporcionaron ingredientes.");
  }

  const prompt = `
    Actúa como un experto maestro de cocina de Medicina Tradicional China (TCM).
    Tengo los siguientes ingredientes en mi cocina: ${ingredients.join(", ")}.
    
    Crea una receta deliciosa y equilibrada basada en los principios de la TCM utilizando principalmente estos ingredientes (puedes sugerir especias básicas adicionales comunes).
    
    Explica detalladamente los beneficios para la salud según la TCM (ej. Yin/Yang, meridianos, Qi).
    
    Responde EXCLUSIVAMENTE en formato JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Nombre creativo del plato" },
          description: { type: Type.STRING, description: "Breve descripción atractiva del plato" },
          ingredients: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista completa de ingredientes con cantidades"
          },
          steps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Pasos paso a paso para cocinar"
          },
          tcmBenefits: { 
            type: Type.STRING, 
            description: "Explicación detallada de los beneficios energéticos y medicinales según la TCM" 
          },
          calories: { type: Type.NUMBER, description: "Calorías estimadas por porción" }
        },
        required: ["title", "description", "ingredients", "steps", "tcmBenefits"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as TCMRecipe;
  } else {
    throw new Error("No se pudo generar la receta.");
  }
};

export const generateDishImage = async (recipeTitle: string, description: string): Promise<string | undefined> => {
  const prompt = `
    Fotografía gastronómica profesional de alta resolución de: ${recipeTitle}.
    Descripción visual: ${description}.
    Estilo: Elegante, iluminación suave natural, vajilla de estilo asiático rústico, vapor saliendo suavemente.
    La comida debe verse deliciosa, saludable y bellamente emplatada.
    Vista cenital o ángulo de 45 grados.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
};

export const editDishImage = async (imageBase64: string, editPrompt: string): Promise<string | undefined> => {
  try {
    // Parse base64 string
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.error("Invalid base64 format provided for editing");
      return undefined;
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `Edit this food image: ${editPrompt}. Maintain the high quality, lighting, and style of the original food photography.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: prompt }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error editing image:", error);
    // Propagate error or return undefined? UI handles undefined as no change or error
    throw error;
  }
};
