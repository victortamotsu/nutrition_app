export type RootStackParamList = {
  Main: undefined;
  BMI: undefined;
  ArmPerimeter: undefined;
  Gyms: undefined;
  Login: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Settings: undefined;
  About: undefined;
};

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'microsoft';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface BMIData {
  gender: 'male' | 'female';
  age: string;
  height: string; // em cm
  weight: string; // em kg
}

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}