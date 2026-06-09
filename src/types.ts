export interface Zone {
  keys: string;
  nombre: string;
  upz: string;
  localidad: string;
  precio_m2: number; // in Millions of Cop (e.g. 11.05 = 11,050,000 COP)
  trafico: number;   // speed in km/h
  walkscore: number; // walk score index (0-100)
  perfil: string;    // buyer profile description
  infra: string;     // target infrastructure catalyst
  salud: string;     // healthcare anchor nearby
  comercio: string;  // retail anchor nearby
}

export interface BarrioCoord {
  nombre: string;
  localidadIndex: number; // index into LOCS
  lat: number;
  lon: number;
}

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  tipo: string;
  direccionConsultada: string;
  zonaIdentificada: string;
  timestamp: string;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

export interface AnalysisState {
  searching: boolean;
  searchedAddress: string | null;
  selectedZone: Zone | null;
  statusText: string;
  unlocked: boolean;
  searchedBarrio?: string | null;
  searchedLocalidad?: string | null;
}
