import React, { useState, useRef } from 'react';
import { TCMRecipe, LoadingState } from './types';
import { generateRecipeFromIngredients, generateDishImage, editDishImage } from './services/geminiService';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [recipe, setRecipe] = useState<TCMRecipe | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAddIngredient = (ing: string) => {
    setIngredients(prev => [...prev, ing]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;

    setLoadingState(LoadingState.GENERATING_RECIPE);
    setError(null);
    setRecipe(null);
    setImageUrl(undefined);

    try {
      // 1. Generate Recipe Text
      const generatedRecipe = await generateRecipeFromIngredients(ingredients);
      setRecipe(generatedRecipe);
      
      // Scroll to results immediately
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // 2. Generate Image (Parallel but UI shows loading separately)
      setLoadingState(LoadingState.GENERATING_IMAGE);
      const img = await generateDishImage(generatedRecipe.title, generatedRecipe.description);
      setImageUrl(img);
      
      setLoadingState(LoadingState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al conectar con los espíritus de la cocina. Por favor intenta de nuevo.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleEditImage = async (prompt: string) => {
    if (!imageUrl) return;

    setLoadingState(LoadingState.GENERATING_IMAGE);
    // Do not clear error here implicitly, but we can clear it if we want to reset state
    // We keep the old image while generating the new one (handled by UI)
    
    try {
      const newImageUrl = await editDishImage(imageUrl, prompt);
      if (newImageUrl) {
        setImageUrl(newImageUrl);
      } else {
        setError("No se pudo modificar la imagen. Intenta con otro comando.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al modificar la imagen.");
    } finally {
      setLoadingState(LoadingState.COMPLETE);
    }
  };

  return (
    <div className="min-h-screen bg-tcm-paper font-sans text-tcm-ink selection:bg-tcm-gold/30">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-tcm-red via-tcm-gold to-tcm-green z-50"></div>
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fadeIn">
          <div className="inline-block p-3 rounded-full bg-tcm-red/5 mb-4">
             <span className="text-4xl">🍜</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-tcm-ink tracking-tight">
            Cocina <span className="text-tcm-red">TCM</span> con Gemini
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Descubre el equilibrio perfecto. Ingresa los ingredientes que tienes en casa y la 
            inteligencia artificial creará una receta basada en la 
            <span className="font-semibold text-tcm-green"> Medicina Tradicional China</span> solo para ti.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-stone-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-tcm-green/20"></div>
          
          <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-tcm-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            ¿Qué hay en tu despensa?
          </h2>
          
          <IngredientInput 
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            disabled={loadingState === LoadingState.GENERATING_RECIPE || loadingState === LoadingState.GENERATING_IMAGE}
          />

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={ingredients.length === 0 || loadingState === LoadingState.GENERATING_RECIPE}
              className={`
                px-8 py-4 rounded-xl font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0
                ${ingredients.length === 0 
                  ? 'bg-stone-300 cursor-not-allowed' 
                  : 'bg-tcm-red hover:bg-red-800 shadow-tcm-red/30'}
                ${loadingState === LoadingState.GENERATING_RECIPE ? 'animate-pulse cursor-wait' : ''}
              `}
            >
              {loadingState === LoadingState.GENERATING_RECIPE ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando Receta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generar Receta
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm animate-fadeIn">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        <div ref={resultsRef} className="min-h-[100px]">
          {recipe && (
            <RecipeCard 
              recipe={recipe} 
              imageUrl={imageUrl} 
              loadingImage={loadingState === LoadingState.GENERATING_IMAGE}
              onEditImage={handleEditImage}
            />
          )}
        </div>

      </main>

      <footer className="py-8 text-center text-stone-400 text-sm">
        <p>© {new Date().getFullYear()} Cocina TCM. Impulsado por Gemini 2.5 Flash & Flash-Image.</p>
      </footer>
    </div>
  );
}

export default App;
