import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import DrawerMenu from '../components/DrawerMenu';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface FeatureCard {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  screen: keyof RootStackParamList;
}

const features: FeatureCard[] = [
  {
    id: '1',
    title: 'Cálculo de IMC',
    icon: 'monitor-weight',
    color: '#4CAF50',
    screen: 'BMI',
  },
  {
    id: '2',
    title: 'Perímetro Braquial',
    icon: 'straighten',
    color: '#2196F3',
    screen: 'ArmPerimeter',
  },
  {
    id: '3',
    title: 'Academias Próximas',
    icon: 'fitness-center',
    color: '#FF5722',
    screen: 'Gyms',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const renderFeatureCard = ({ item }: { item: FeatureCard }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={40} color="#fff" />
      </View>
      <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Nutrition App" 
        showMenu 
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <DrawerMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)}
      />
      
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.emoji}>🥗</Text>
          <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>Bem-vindo!</Text>
          <Text style={[styles.welcomeText, { color: colors.onSurfaceVariant }]}>
            Escolha uma das opções abaixo para começar
          </Text>
        </View>

        <FlatList
          data={features}
          renderItem={renderFeatureCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
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
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});