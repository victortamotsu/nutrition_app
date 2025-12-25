import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function ArmPerimeterScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Perímetro Braquial" 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <MaterialIcons name="construction" size={80} color={colors.primary} />
          <Text style={[styles.title, { color: colors.onSurface }]}>
            Em Desenvolvimento
          </Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            A funcionalidade de medição do perímetro braquial está sendo desenvolvida.
            Em breve estará disponível!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  comingSoonContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});