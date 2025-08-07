import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean;
  address: {
    street: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    postalCode: string | null;
    name: string | null;
  } | null;
  isGeocoding: boolean;
}

export function useLocation(options?: {
  enableHighAccuracy?: boolean;
  timeInterval?: number;
  distanceInterval?: number;
  requestPermission?: boolean;
  enableGeocoding?: boolean;
}) {
  const {
    enableHighAccuracy = true,
    timeInterval = 10000, // 10 seconds
    distanceInterval = 10, // 10 meters
    requestPermission = true,
    enableGeocoding = true,
  } = options || {};

  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    isLoading: true,
    hasPermission: false,
    address: null,
    isGeocoding: false,
  });

  // Geocoding function
  const geocodeLocation = async (latitude: number, longitude: number) => {
    if (!enableGeocoding) return null;
    
    try {
      setLocationState(prev => ({ ...prev, isGeocoding: true }));
      
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodeResult.length > 0) {
        const address = geocodeResult[0];
        return {
          street: address.street || null,
          city: address.city || null,
          region: address.region || null,
          country: address.country || null,
          postalCode: address.postalCode || null,
          name: address.name || null,
        };
      }
      return null;
    } catch (error) {
      console.warn('Geocoding failed:', error);
      return null;
    } finally {
      setLocationState(prev => ({ ...prev, isGeocoding: false }));
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const getLocation = async () => {
      try {
        setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

        // Check if location services are enabled
        const isEnabled = await Location.hasServicesEnabledAsync();
        if (!isEnabled) {
          setLocationState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Location services are disabled',
          }));
          return;
        }

        // Request permissions if needed
        if (requestPermission) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocationState(prev => ({
              ...prev,
              isLoading: false,
              error: 'Location permission denied',
              hasPermission: false,
            }));
            return;
          }
          setLocationState(prev => ({ ...prev, hasPermission: true }));
        }

        // Get current position
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
        });

        // Geocode the location
        const address = await geocodeLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);

        setLocationState({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: currentLocation.timestamp,
          error: null,
          isLoading: false,
          hasPermission: true,
          address,
          isGeocoding: false,
        });

        // Start watching location updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
            timeInterval,
            distanceInterval,
          },
          async (location) => {
            // Geocode the new location
            const newAddress = await geocodeLocation(location.coords.latitude, location.coords.longitude);
            
            setLocationState({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              timestamp: location.timestamp,
              error: null,
              isLoading: false,
              hasPermission: true,
              address: newAddress,
              isGeocoding: false,
            });
          }
        );
      } catch (error) {
        setLocationState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to get location',
        }));
      }
    };

    getLocation();

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [enableHighAccuracy, timeInterval, distanceInterval, requestPermission, enableGeocoding]);

  const getCurrentLocation = async () => {
    try {
      setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
      });

      // Geocode the location
      const address = await geocodeLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);

      setLocationState({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: currentLocation.timestamp,
        error: null,
        isLoading: false,
        hasPermission: true,
        address,
        isGeocoding: false,
      });
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get current location',
      }));
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      
      setLocationState(prev => ({
        ...prev,
        hasPermission,
        error: hasPermission ? null : 'Location permission denied',
      }));

      return hasPermission;
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        hasPermission: false,
        error: error instanceof Error ? error.message : 'Failed to request permission',
      }));
      return false;
    }
  };

  return {
    ...locationState,
    getCurrentLocation,
    requestLocationPermission,
  };
} 