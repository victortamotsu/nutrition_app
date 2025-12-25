import { BMIData, BMIResult } from '../types';

export function calculateBMI(data: BMIData): BMIResult {
  const height = parseFloat(data.height) / 100; // converter cm para m
  const weight = parseFloat(data.weight);
  const bmi = weight / (height * height);

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Abaixo do peso';
    color = '#2196F3';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Peso normal';
    color = '#4CAF50';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Sobrepeso';
    color = '#FF9800';
  } else {
    category = 'Obesidade';
    color = '#F44336';
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    color
  };
}

export function isFormValid(data: BMIData): boolean {
  return !!(
    data.gender &&
    data.age &&
    parseFloat(data.age) > 0 &&
    data.height &&
    parseFloat(data.height) > 0 &&
    data.weight &&
    parseFloat(data.weight) > 0
  );
}