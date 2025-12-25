import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BMIData, BMIResult } from '../types';
import { calculateBMI, isFormValid } from '../utils/bmi';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function BMIScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [formData, setFormData] = useState<BMIData>({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
  });
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleCalculate = () => {
    if (!isFormValid(formData)) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente');
      return;
    }

    const bmiResult = calculateBMI(formData);
    setResult(bmiResult);
  };

  const resetForm = () => {
    setFormData({
      gender: 'male',
      age: '',
      height: '',
      weight: '',
    });
    setResult(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Cálculo de IMC" 
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Seus Dados
          </Text>
          
          {/* Sexo */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Sexo</Text>
            <View style={[styles.pickerContainer, { 
              borderColor: colors.outline,
              backgroundColor: colors.surface 
            }]}>
              <Picker
                selectedValue={formData.gender}
                style={[styles.picker, { color: colors.onSurface }]}
                dropdownIconColor={colors.onSurfaceVariant}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, gender: itemValue })
                }
              >
                <Picker.Item label="Masculino" value="male" />
                <Picker.Item label="Feminino" value="female" />
              </Picker>
            </View>
          </View>

          {/* Idade */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Idade (anos)</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.outline,
                backgroundColor: colors.surface,
                color: colors.onSurface
              }]}
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              placeholder="Ex: 25"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="numeric"
            />
          </View>

          {/* Altura */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Altura (cm)</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.outline,
                backgroundColor: colors.surface,
                color: colors.onSurface
              }]}
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              placeholder="Ex: 170"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="numeric"
            />
          </View>

          {/* Peso */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Peso (kg)</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.outline,
                backgroundColor: colors.surface,
                color: colors.onSurface
              }]}
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              placeholder="Ex: 70"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="numeric"
            />
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.calculateButton,
                { backgroundColor: colors.primary },
                !isFormValid(formData) && { backgroundColor: colors.outline },
              ]}
              onPress={handleCalculate}
              disabled={!isFormValid(formData)}
            >
              <MaterialIcons name="calculate" size={24} color={colors.onPrimary} />
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
                Calcular IMC
              </Text>
            </TouchableOpacity>

            {result && (
              <TouchableOpacity 
                style={[styles.resetButton, { borderColor: colors.primary }]} 
                onPress={resetForm}
              >
                <MaterialIcons name="refresh" size={24} color={colors.primary} />
                <Text style={[styles.resetButtonText, { color: colors.primary }]}>
                  Novo Cálculo
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Resultado */}
          {result && (
            <View style={[styles.resultCard, { 
              borderColor: result.color,
              backgroundColor: colors.surface 
            }]}>
              <View style={styles.resultHeader}>
                <MaterialIcons name="assessment" size={32} color={result.color} />
                <Text style={[styles.resultTitle, { color: colors.onSurface }]}>
                  Seu Resultado
                </Text>
              </View>
              
              <View style={styles.resultContent}>
                <Text style={[styles.bmiValue, { color: colors.onSurface }]}>
                  IMC: <Text style={[styles.bmiNumber, { color: result.color }]}>
                    {result.bmi}
                  </Text>
                </Text>
                <Text style={[styles.bmiCategory, { color: result.color }]}>
                  {result.category}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  resultContent: {
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 18,
    marginBottom: 8,
  },
  bmiNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  bmiCategory: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});