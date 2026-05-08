/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

// Default fallback location (Bangalore city center)
const DEFAULT_LOCATION = {
  lat: 12.9716,
  lng: 77.5946
};

export function useGeolocation(enableHighAccuracy = true) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    permissionDenied: false,
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lng,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (error) => {
        const isPermissionDenied = error.code === error.PERMISSION_DENIED;
        setState({
          latitude: DEFAULT_LOCATION.lat,
          longitude: DEFAULT_LOCATION.lng,
          accuracy: null,
          error: error.message,
          loading: false,
          permissionDenied: isPermissionDenied,
        });
      },
      {
        enableHighAccuracy,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [enableHighAccuracy]);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const refreshLocation = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    ...state,
    coords: state.latitude && state.longitude 
      ? { lat: state.latitude, lng: state.longitude }
      : DEFAULT_LOCATION,
    refreshLocation,
    DEFAULT_LOCATION,
  };
}
