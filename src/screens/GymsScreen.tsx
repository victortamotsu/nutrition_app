import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Academias de exemplo (em produção, você buscaria de uma API)
const mockGyms = [
  { id: '1', name: 'Academia Fitness Plus', latitude: 0, longitude: 0 },
  { id: '2', name: 'Smart Fit', latitude: 0, longitude: 0 },
  { id: '3', name: 'Bio Ritmo', latitude: 0, longitude: 0 },
];

export default function GymsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gyms, setGyms] = useState<typeof mockGyms>([]);

  useEffect(() => {
    (async () => {
      try {
        // Solicitar permissão de localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          setLoading(false);
          return;
        }

        // Obter localização atual
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const coords: LocationCoords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(coords);

        // Gerar academias próximas (mock - em produção usaria Google Places API)
        const nearbyGyms = mockGyms.map((gym, index) => ({
          ...gym,
          latitude: coords.latitude + (Math.random() - 0.5) * 0.02,
          longitude: coords.longitude + (Math.random() - 0.5) * 0.02,
        }));
        
        setGyms(nearbyGyms);
      } catch (error) {
        setErrorMsg('Erro ao obter localização');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleGymPress = (gym: typeof mockGyms[0]) => {
    Alert.alert(
      gym.name,
      'Deseja abrir no Google Maps para traçar rota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Abrir', 
          onPress: () => {
            // Em produção, abriria o Google Maps com direções
            Alert.alert('Info', `Abrindo rota para ${gym.name}`);
          }
        },
      ]
    );
  };

  const centerOnUser = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Academias" 
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Obtendo localização...
          </Text>
        </View>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Academias" 
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <MaterialIcons name="location-off" size={80} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.onSurface }]}>
            {errorMsg}
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.onSurfaceVariant }]}>
            Habilite a localização nas configurações do dispositivo para visualizar academias próximas.
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setErrorMsg(null);
              setLoading(true);
              Location.requestForegroundPermissionsAsync().then(({ status }) => {
                if (status === 'granted') {
                  centerOnUser();
                } else {
                  setLoading(false);
                  setErrorMsg('Permissão de localização negada');
                }
              });
            }}
          >
            <Text style={[styles.retryButtonText, { color: colors.onPrimary }]}>
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Academias" 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={location}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {/* Marcadores das academias */}
            {gyms.map((gym) => (
              <Marker
                key={gym.id}
                coordinate={{
                  latitude: gym.latitude,
                  longitude: gym.longitude,
                }}
                title={gym.name}
                description="Toque para mais informações"
                onCalloutPress={() => handleGymPress(gym)}
              >
                <View style={[styles.markerContainer, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="fitness-center" size={20} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>
        )}

        {/* Botão para centralizar no usuário */}
        <TouchableOpacity 
          style={[styles.centerButton, { backgroundColor: colors.surface }]}
          onPress={centerOnUser}
        >
          <MaterialIcons name="my-location" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Legenda */}
        <View style={[styles.legend, { backgroundColor: colors.surface }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="fitness-center" size={12} color="#fff" />
            </View>
            <Text style={[styles.legendText, { color: colors.onSurface }]}>
              Academias ({gyms.length})
            </Text>
          </View>
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centerButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
  },
});