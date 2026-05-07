/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// --- Types ---

export type Severity = 'Critical' | 'Moderate' | 'Stable';

export enum EmergencyStatus {
  SUBMITTED = 'Request Submitted',
  DISPATCHING = 'AI Dispatching',
  ASSIGNED = 'Ambulance Assigned',
  EN_ROUTE_PICKUP = 'En Route to Patient',
  ARRIVED_PICKUP = 'Arrived at Location',
  PICKED_UP = 'Patient Picked Up',
  EN_ROUTE_HOSPITAL = 'En Route to Hospital',
  ARRIVED_HOSPITAL = 'Arrived at Hospital',
  ADMITTED = 'Admitted',
  COMPLETED = 'Case Completed'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hospital {
  id: string;
  name: string;
  coords: Coordinates;
  icuBeds: number;
  generalBeds: number;
  specializations: string[];
}

export interface Ambulance {
  id: string;
  name: string;
  coords: Coordinates;
  status: 'Available' | 'Dispatched' | 'Busy';
  assignedEmergencyId?: string | null;
  plateNumber: string;
  driverName: string;
}

export interface Emergency {
  id: string;
  patientName: string;
  contactNumber: string;
  emergencyType: string;
  severity: Severity;
  symptoms: string;
  pickupCoords: Coordinates;
  status: EmergencyStatus;
  ambulanceId?: string | null;
  hospitalId?: string | null;
  createdAt: number;
  updatedAt: number;
  eta: number; // in seconds
  notes?: string;
}

interface SimulationState {
  hospitals: Hospital[];
  ambulances: Ambulance[];
  emergencies: Emergency[];
  trafficLevel: 'Low' | 'Medium' | 'Heavy';
}

interface SimulationContextType extends SimulationState {
  createEmergency: (emergency: Omit<Emergency, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'eta' | 'ambulanceId' | 'hospitalId'>) => string;
  updateEmergencyStatus: (id: string, status: EmergencyStatus) => void;
  updateAmbulanceStatus: (id: string, status: Ambulance['status'], emergencyId?: string | null) => void;
  updateHospitalBeds: (id: string, type: 'icu' | 'general', count: number) => void;
  setTrafficLevel: (level: SimulationState['trafficLevel']) => void;
  resetSimulation: () => void;
}

// --- Initial Data ---

const BENGALURU_CENTER: Coordinates = { lat: 12.9716, lng: 77.5946 };

const INITIAL_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Manipal Hospital, Old Airport Road', coords: { lat: 12.9602, lng: 77.6433 }, icuBeds: 12, generalBeds: 45, specializations: ['Cardiology', 'Neurology', 'Trauma'] },
  { id: 'h2', name: 'Fortis Hospital, Bannerghatta', coords: { lat: 12.8953, lng: 77.5976 }, icuBeds: 8, generalBeds: 30, specializations: ['Orthopedics', 'Pediatrics'] },
  { id: 'h3', name: 'Apollo Hospitals, Jayanagar', coords: { lat: 12.9238, lng: 77.5833 }, icuBeds: 15, generalBeds: 50, specializations: ['Cardiac Care', 'Emergency Surgery'] },
  { id: 'h4', name: 'Narayana Health City', coords: { lat: 12.8122, lng: 77.6937 }, icuBeds: 40, generalBeds: 150, specializations: ['Multi-specialty', 'Organ Transplant'] },
  { id: 'h5', name: 'St. John\'s Medical College Hospital', coords: { lat: 12.9341, lng: 77.6127 }, icuBeds: 25, generalBeds: 100, specializations: ['General Medicine', 'Burn Care'] },
];

const INITIAL_AMBULANCES: Ambulance[] = [
  { id: 'a1', name: 'Smart Ambulance 01', plateNumber: 'KA-01-EB-1234', driverName: 'Ramesh Kumar', coords: { lat: 12.9716, lng: 77.5946 }, status: 'Available' },
  { id: 'a2', name: 'Smart Ambulance 02', plateNumber: 'KA-03-MB-5678', driverName: 'Suresh Singh', coords: { lat: 12.9300, lng: 77.6000 }, status: 'Available' },
  { id: 'a3', name: 'Smart Ambulance 03', plateNumber: 'KA-05-AB-9012', driverName: 'Anand Rao', coords: { lat: 12.9500, lng: 77.6500 }, status: 'Available' },
  { id: 'a4', name: 'Smart Ambulance 04', plateNumber: 'KA-02-ZZ-3456', driverName: 'Vijay Maller', coords: { lat: 12.9000, lng: 77.5800 }, status: 'Available' },
];

// --- Context Provider ---

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SimulationState>(() => {
    const saved = localStorage.getItem('arogyavahini_state');
    if (saved) return JSON.parse(saved);
    return {
      hospitals: INITIAL_HOSPITALS,
      ambulances: INITIAL_AMBULANCES,
      emergencies: [],
      trafficLevel: 'Medium',
    };
  });

  useEffect(() => {
    localStorage.setItem('arogyavahini_state', JSON.stringify(state));
  }, [state]);

  // --- Logic Helpers ---

  const calculateDistance = (c1: Coordinates, c2: Coordinates) => {
    return Math.sqrt(Math.pow(c1.lat - c2.lat, 2) + Math.pow(c1.lng - c2.lng, 2));
  };

  const getTrafficMultiplier = (level: SimulationState['trafficLevel']) => {
    switch (level) {
      case 'Low': return 1;
      case 'Medium': return 1.5;
      case 'Heavy': return 3;
    }
  };

  // --- Simulation Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        let changed = false;
        const newAmbulances = prev.ambulances.map(amb => {
          if (amb.status === 'Available' || !amb.assignedEmergencyId) return amb;

          const emergency = prev.emergencies.find(e => e.id === amb.assignedEmergencyId);
          if (!emergency) return amb;

          // Target logic based on status
          let target: Coordinates | null = null;
          if (emergency.status === EmergencyStatus.EN_ROUTE_PICKUP) {
            target = emergency.pickupCoords;
          } else if (emergency.status === EmergencyStatus.EN_ROUTE_HOSPITAL && emergency.hospitalId) {
            const hospital = prev.hospitals.find(h => h.id === emergency.hospitalId);
            if (hospital) target = hospital.coords;
          }

          if (target) {
            const dist = calculateDistance(amb.coords, target);
            const speed = 0.0005 / getTrafficMultiplier(prev.trafficLevel); // Simulation speed

            if (dist < speed) {
              // Arrived
              changed = true;
              // We'll update the emergency status in a separate logic or auto-transition
              return { ...amb, coords: target };
            } else {
              changed = true;
              const ratio = speed / dist;
              return {
                ...amb,
                coords: {
                  lat: amb.coords.lat + (target.lat - amb.coords.lat) * ratio,
                  lng: amb.coords.lng + (target.lng - amb.coords.lng) * ratio,
                }
              };
            }
          }
          return amb;
        });

        const newEmergencies = prev.emergencies.map(e => {
          const amb = newAmbulances.find(a => a.id === e.ambulanceId);
          if (!amb) return e;

          // Auto-transitions for simulation feel
          if (e.status === EmergencyStatus.EN_ROUTE_PICKUP && calculateDistance(amb.coords, e.pickupCoords) < 0.0001) {
            changed = true;
            return { ...e, status: EmergencyStatus.ARRIVED_PICKUP, updatedAt: Date.now(), eta: 0 };
          }
          if (e.status === EmergencyStatus.EN_ROUTE_HOSPITAL && e.hospitalId) {
            const hospital = prev.hospitals.find(h => h.id === e.hospitalId);
            if (hospital && calculateDistance(amb.coords, hospital.coords) < 0.0001) {
              changed = true;
              return { ...e, status: EmergencyStatus.ARRIVED_HOSPITAL, updatedAt: Date.now(), eta: 0 };
            }
          }

          // Update ETA
          let targetCoords: Coordinates | null = null;
          if (e.status === EmergencyStatus.EN_ROUTE_PICKUP) targetCoords = e.pickupCoords;
          else if (e.status === EmergencyStatus.EN_ROUTE_HOSPITAL && e.hospitalId) {
             targetCoords = prev.hospitals.find(h => h.id === e.hospitalId)?.coords || null;
          }

          if (targetCoords) {
             const dist = calculateDistance(amb.coords, targetCoords);
             const newEta = Math.round(dist * 10000 * getTrafficMultiplier(prev.trafficLevel));
             if (newEta !== e.eta) {
                changed = true;
                return { ...e, eta: newEta };
             }
          }

          return e;
        });

        return changed ? { ...prev, ambulances: newAmbulances, emergencies: newEmergencies } : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.trafficLevel]);

  // --- Actions ---

  const createEmergency = (emergencyData: Omit<Emergency, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'eta' | 'ambulanceId' | 'hospitalId'>) => {
    const id = `emergency-${Date.now()}`;
    const newEmergency: Emergency = {
      ...emergencyData,
      id,
      status: EmergencyStatus.SUBMITTED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      eta: 0,
      ambulanceId: null,
      hospitalId: null,
    };

    setState(prev => {
      // AI Dispatch Logic
      const availableAmbs = prev.ambulances.filter(a => a.status === 'Available');
      let assignedAmbId = null;
      let recommendedHospitalId = null;

      if (availableAmbs.length > 0) {
        // Simple nearest ambulance
        const nearest = availableAmbs.reduce((prevAmb, currAmb) => {
          const prevDist = calculateDistance(prevAmb.coords, emergencyData.pickupCoords);
          const currDist = calculateDistance(currAmb.coords, emergencyData.pickupCoords);
          return currDist < prevDist ? currAmb : prevAmb;
        });
        assignedAmbId = nearest.id;
      }

      // AI Hospital Recommendation
      const hospitals = [...prev.hospitals].sort((a, b) => {
        const distA = calculateDistance(a.coords, emergencyData.pickupCoords);
        const distB = calculateDistance(b.coords, emergencyData.pickupCoords);
        
        // Severity weight
        if (emergencyData.severity === 'Critical') {
          // Prioritize ICU beds then distance
          if (a.icuBeds > 0 && b.icuBeds === 0) return -1;
          if (b.icuBeds > 0 && a.icuBeds === 0) return 1;
        }
        return distA - distB;
      });
      recommendedHospitalId = hospitals[0].id;

      const dispatchedEmergency: Emergency = {
        ...newEmergency,
        status: assignedAmbId ? EmergencyStatus.ASSIGNED : EmergencyStatus.DISPATCHING,
        ambulanceId: assignedAmbId,
        hospitalId: recommendedHospitalId,
      };

      const newState = {
        ...prev,
        emergencies: [dispatchedEmergency, ...prev.emergencies],
        ambulances: prev.ambulances.map(a => a.id === assignedAmbId ? { ...a, status: 'Dispatched' as const, assignedEmergencyId: id } : a)
      };

      return newState;
    });

    return id;
  };

  const updateEmergencyStatus = (id: string, status: EmergencyStatus) => {
    setState(prev => {
      const e = prev.emergencies.find(ex => ex.id === id);
      if (!e) return prev;

      // Handle related ambulance status changes
      let ambulances = prev.ambulances;
      if (status === EmergencyStatus.COMPLETED) {
        ambulances = ambulances.map(a => a.id === e.ambulanceId ? { ...a, status: 'Available' as const, assignedEmergencyId: null } : a);
      }

      return {
        ...prev,
        emergencies: prev.emergencies.map(ex => ex.id === id ? { ...ex, status, updatedAt: Date.now() } : ex),
        ambulances
      };
    });
  };

  const updateAmbulanceStatus = (id: string, status: Ambulance['status'], emergencyId: string | null = null) => {
    setState(prev => ({
      ...prev,
      ambulances: prev.ambulances.map(a => a.id === id ? { ...a, status, assignedEmergencyId: emergencyId } : a)
    }));
  };

  const updateHospitalBeds = (id: string, type: 'icu' | 'general', count: number) => {
    setState(prev => ({
      ...prev,
      hospitals: prev.hospitals.map(h => h.id === id ? { ...h, [type === 'icu' ? 'icuBeds' : 'generalBeds']: count } : h)
    }));
  };

  const setTrafficLevel = (level: SimulationState['trafficLevel']) => {
    setState(prev => ({ ...prev, trafficLevel: level }));
  };

  const resetSimulation = () => {
    setState({
      hospitals: INITIAL_HOSPITALS,
      ambulances: INITIAL_AMBULANCES,
      emergencies: [],
      trafficLevel: 'Medium',
    });
    localStorage.removeItem('arogyavahini_state');
  };

  return (
    <SimulationContext.Provider value={{ ...state, createEmergency, updateEmergencyStatus, updateAmbulanceStatus, updateHospitalBeds, setTrafficLevel, resetSimulation }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
