import React, { useState, KeyboardEvent } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  disabled?: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ 
  ingredients, 
  onAddIngredient, 
  onRemoveIngredient,
  disabled 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  const add = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      onAddIngredient(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ej. Arroz, Jengibre, Pollo..."
          className="w-full px-4 py-3 pr-12 text-lg border-2 border-tcm-green/20 rounded-xl focus:outline-none focus:border-tcm-green focus:ring-2 focus:ring-tcm-green/10 bg-white transition-all shadow-sm"
        />
        <button
          onClick={add}
          disabled={!inputValue.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-tcm-green text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[3rem]">
        {ingredients.length === 0 && (
          <p className="text-stone-400 text-sm italic w-full text-center py-2">
            Agrega los ingredientes que tienes en tu cocina
          </p>
        )}
        {ingredients.map((ing, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-tcm-green/10 text-tcm-green border border-tcm-green/20 animate-fadeIn"
          >
            {ing}
            <button
              onClick={() => onRemoveIngredient(index)}
              disabled={disabled}
              className="ml-2 text-tcm-green/60 hover:text-tcm-red focus:outline-none transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;