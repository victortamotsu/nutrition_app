import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  showMenu?: boolean;
}

export default function Header({ title, onBackPress, onMenuPress, showMenu = false }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const statusBarHeight = Platform.OS === 'android' 
    ? StatusBar.currentHeight || 0 
    : insets.top;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.primary,
        paddingTop: statusBarHeight + 8,
      }
    ]}>
      <View style={styles.content}>
        {showMenu && onMenuPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress}
          >
            <MaterialIcons name="menu" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        )}
        
        {onBackPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBackPress}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        )}
        
        {!showMenu && !onBackPress && <View style={styles.iconButton} />}
        
        <Text style={[styles.title, { color: colors.onPrimary }]}>{title}</Text>
        
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleTheme}
          >
            <MaterialIcons 
              name={isDarkMode ? 'light-mode' : 'dark-mode'} 
              size={24} 
              color={colors.onPrimary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Login')}
          >
            {isAuthenticated && user?.picture ? (
              <Image 
                source={{ uri: user.picture }} 
                style={styles.userAvatar}
              />
            ) : (
              <MaterialIcons name="account-circle" size={24} color={colors.onPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
  },
});