import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { signInWithGoogle, signInWithMicrosoft, isLoading, isAuthenticated } = useAuth();

  // Se já autenticado, voltar
  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.goBack();
    }
  }, [isAuthenticated, navigation]);

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleMicrosoftLogin = async () => {
    await signInWithMicrosoft();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Entrar" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Autenticando...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Entrar" onBackPress={() => navigation.goBack()} />
      
      <View style={styles.content}>
        {/* Logo / Ilustração */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primaryContainer }]}>
            <MaterialIcons name="restaurant-menu" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            Nutrition App
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Entre para salvar seus dados e sincronizar entre dispositivos
          </Text>
        </View>

        {/* Botões de Login */}
        <View style={styles.buttonsSection}>
          {/* Google Button */}
          <TouchableOpacity
            style={[styles.loginButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.providerIcon}
            />
            <Text style={styles.googleButtonText}>Continuar com Google</Text>
          </TouchableOpacity>

          {/* Microsoft Button */}
          <TouchableOpacity
            style={[styles.loginButton, styles.microsoftButton]}
            onPress={handleMicrosoftLogin}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://www.microsoft.com/favicon.ico' }}
              style={styles.providerIcon}
            />
            <Text style={styles.microsoftButtonText}>Continuar com Microsoft</Text>
          </TouchableOpacity>
        </View>

        {/* Termos */}
        <View style={styles.termsSection}>
          <Text style={[styles.termsText, { color: colors.onSurfaceVariant }]}>
            Ao continuar, você concorda com nossos{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>
              Termos de Uso
            </Text>{' '}
            e{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>
              Política de Privacidade
            </Text>
          </Text>
        </View>

        {/* Continuar sem login */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.skipButtonText, { color: colors.onSurfaceVariant }]}>
            Continuar sem conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonsSection: {
    gap: 16,
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  microsoftButton: {
    backgroundColor: '#2f2f2f',
  },
  providerIcon: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3c4043',
  },
  microsoftButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  termsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    padding: 12,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
