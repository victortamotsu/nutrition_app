import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  colors: any;
}

function MenuItem({ icon, label, onPress, colors }: MenuItemProps) {
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={24} color={colors.onSurfaceVariant} />
      <Text style={[styles.menuItemText, { color: colors.onSurface }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DrawerMenu({ visible, onClose, onNavigate }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const { width } = Dimensions.get('window');
  
  const statusBarHeight = Platform.OS === 'android' 
    ? StatusBar.currentHeight || 0 
    : insets.top;

  const handleLogout = () => {
    if (!isAuthenticated) {
      onClose();
      navigation.navigate('Login');
      return;
    }
    
    onClose();
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => signOut() },
      ]
    );
  };

  const handleSettings = () => {
    onClose();
    Alert.alert('Configurações', 'Em desenvolvimento');
  };

  const handleAbout = () => {
    onClose();
    Alert.alert(
      'Sobre',
      'Nutrition App v1.0.0\n\nAplicativo para cálculos nutricionais e acompanhamento de saúde.'
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[
              styles.drawer, 
              { 
                backgroundColor: colors.background,
                width: width * 0.75,
                maxWidth: 300,
              }
            ]}>
              {/* Header do Menu */}
              <View style={[
                styles.header, 
                { 
                  backgroundColor: colors.surfaceVariant,
                  paddingTop: statusBarHeight + 16,
                }
              ]}>
                <View style={styles.userContainer}>
                  {isAuthenticated && user ? (
                    <>
                      {user.picture ? (
                        <Image 
                          source={{ uri: user.picture }} 
                          style={styles.userAvatar}
                        />
                      ) : (
                        <MaterialIcons name="account-circle" size={60} color={colors.primary} />
                      )}
                      <Text style={[styles.userName, { color: colors.onSurface }]}>{user.name}</Text>
                      <Text style={[styles.userEmail, { color: colors.onSurfaceVariant }]}>
                        {user.email}
                      </Text>
                      <View style={[styles.providerBadge, { backgroundColor: colors.primaryContainer }]}>
                        <MaterialIcons 
                          name={user.provider === 'google' ? 'g-mobiledata' : 'window'} 
                          size={14} 
                          color={colors.primary} 
                        />
                        <Text style={[styles.providerText, { color: colors.primary }]}>
                          {user.provider === 'google' ? 'Google' : 'Microsoft'}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <MaterialIcons name="account-circle" size={60} color={colors.onSurfaceVariant} />
                      <Text style={[styles.userName, { color: colors.onSurface }]}>Visitante</Text>
                      <TouchableOpacity 
                        style={[styles.loginPrompt, { backgroundColor: colors.primary }]}
                        onPress={() => {
                          onClose();
                          navigation.navigate('Login');
                        }}
                      >
                        <Text style={[styles.loginPromptText, { color: colors.onPrimary }]}>
                          Entrar na conta
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              {/* Menu Items */}
              <View style={styles.menuContent}>
                <MenuItem
                  icon="home"
                  label="Início"
                  onPress={onClose}
                  colors={colors}
                />
                
                <MenuItem
                  icon={isDarkMode ? 'light-mode' : 'dark-mode'}
                  label={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                  onPress={handleThemeToggle}
                  colors={colors}
                />
                
                <MenuItem
                  icon="settings"
                  label="Configurações"
                  onPress={handleSettings}
                  colors={colors}
                />
                
                <MenuItem
                  icon="info"
                  label="Sobre"
                  onPress={handleAbout}
                  colors={colors}
                />
                
                <View style={[styles.divider, { backgroundColor: colors.outline }]} />
                
                <MenuItem
                  icon="logout"
                  label={isAuthenticated ? "Sair" : "Entrar"}
                  onPress={handleLogout}
                  colors={colors}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  drawer: {
    flex: 1,
    maxWidth: 300,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  userContainer: {
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  providerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loginPrompt: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  loginPromptText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuContent: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
    marginHorizontal: 20,
  },
});