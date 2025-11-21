import React from 'react';
import { TCMRecipe } from '../types';

interface RecipeCardProps {
  recipe: TCMRecipe;
  imageUrl?: string;
  loadingImage: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, imageUrl, loadingImage }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100 animate-fadeInUp">
      {/* Header Image Section */}
      <div className="relative w-full h-64 md:h-80 bg-stone-100">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover animate-fadeIn"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
            {loadingImage ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-green mb-4"></div>
                <span className="text-sm font-serif italic">Pintando tu platillo con Qi digital...</span>
              </>
            ) : (
              <span className="text-sm italic">Imagen no disponible</span>
            )}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-md mb-1">
            {recipe.title}
          </h2>
          <p className="text-white/90 text-sm md:text-base font-medium max-w-2xl">
            {recipe.description}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-0">
        {/* Sidebar - Ingredients & Steps */}
        <div className="md:col-span-1 bg-stone-50 p-6 border-r border-stone-100">
          <h3 className="font-serif font-bold text-xl text-tcm-green mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Ingredientes
          </h3>
          <ul className="space-y-2 mb-8 text-stone-700 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-tcm-green mt-1.5">•</span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-stone-200 my-6"></div>

          <h3 className="font-serif font-bold text-xl text-tcm-green mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instrucciones
          </h3>
          <ol className="space-y-4 text-stone-700 text-sm">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-tcm-gold/20 text-tcm-gold font-bold text-xs">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Main Content - TCM Benefits */}
        <div className="md:col-span-2 p-6 md:p-8">
          <div className="bg-tcm-paper border border-tcm-gold/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-tcm-red">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
               </svg>
            </div>

            <h3 className="font-serif font-bold text-2xl text-tcm-red mb-4 flex items-center gap-3">
              <span className="text-3xl">☯</span>
              Sabiduría de la Medicina Tradicional
            </h3>
            
            <div className="prose prose-stone prose-p:text-stone-700 prose-headings:text-tcm-ink max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {recipe.tcmBenefits}
              </p>
            </div>

            {recipe.calories && (
               <div className="mt-6 pt-4 border-t border-tcm-gold/20 flex items-center text-stone-500 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                  </svg>
                  Energía estimada: {recipe.calories} kcal
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;