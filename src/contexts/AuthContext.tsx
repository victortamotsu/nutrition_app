import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '../types';

// Completa a sessão de autenticação quando o app é reaberto
WebBrowser.maybeCompleteAuthSession();

// ⚠️ CONFIGURE SUAS CREDENCIAIS AQUI
// Google OAuth - Obtenha em https://console.cloud.google.com
const GOOGLE_CLIENT_ID = '188896624644-197e0kko2qi2krp7pv5nt0ldfon889un.apps.googleusercontent.com';

// Microsoft OAuth - Obtenha em https://portal.azure.com
const MICROSOFT_CLIENT_ID = 'YOUR_MICROSOFT_CLIENT_ID';
const MICROSOFT_TENANT_ID = 'common'; // ou seu tenant específico

// Endpoints de descoberta OAuth
const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const microsoftDiscovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
};

// Chaves para SecureStore
const USER_STORAGE_KEY = 'nutrition_app_user';
const TOKEN_STORAGE_KEY = 'nutrition_app_token';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect URI para Expo
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'nutrition-app',
  });

  // Configuração do Google OAuth
  const [googleRequest, googleResponse, googlePromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    googleDiscovery
  );

  // Configuração do Microsoft OAuth
  const [microsoftRequest, microsoftResponse, microsoftPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: MICROSOFT_CLIENT_ID,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri,
    },
    microsoftDiscovery
  );

  // Carregar usuário salvo ao iniciar
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Processar resposta do Google
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      if (authentication?.accessToken) {
        fetchGoogleUserInfo(authentication.accessToken);
      }
    }
  }, [googleResponse]);

  // Processar resposta da Microsoft
  useEffect(() => {
    if (microsoftResponse?.type === 'success') {
      const { authentication } = microsoftResponse;
      if (authentication?.accessToken) {
        fetchMicrosoftUserInfo(authentication.accessToken);
      }
    }
  }, [microsoftResponse]);

  const loadStoredUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User, token?: string) => {
    try {
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));
      if (token) {
        await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
      }
      setUser(userData);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const fetchGoogleUserInfo = async (accessToken: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      
      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        provider: 'google',
      };
      
      await saveUser(userData, accessToken);
    } catch (error) {
      console.error('Erro ao buscar informações do Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMicrosoftUserInfo = async (accessToken: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      
      // Buscar foto do perfil
      let pictureUrl: string | undefined;
      try {
        const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (photoResponse.ok) {
          const blob = await photoResponse.blob();
          // Converter blob para base64 URL
          const reader = new FileReader();
          pictureUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch {
        // Foto não disponível
      }
      
      const userData: User = {
        id: data.id,
        email: data.mail || data.userPrincipalName,
        name: data.displayName,
        picture: pictureUrl,
        provider: 'microsoft',
      };
      
      await saveUser(userData, accessToken);
    } catch (error) {
      console.error('Erro ao buscar informações da Microsoft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = useCallback(async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error('Erro no login com Google:', error);
    }
  }, [googlePromptAsync]);

  const signInWithMicrosoft = useCallback(async () => {
    try {
      await microsoftPromptAsync();
    } catch (error) {
      console.error('Erro no login com Microsoft:', error);
    }
  }, [microsoftPromptAsync]);

  const signOut = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
