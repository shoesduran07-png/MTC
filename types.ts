export interface TCMRecipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tcmBenefits: string;
  calories?: number;
}

export interface GeneratedContent {
  recipe: TCMRecipe;
  imageUrl?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  GENERATING_RECIPE = 'GENERATING_RECIPE',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}