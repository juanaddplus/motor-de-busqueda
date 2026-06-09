import { Zone, BarrioCoord, GeocodeResult } from "./types";
import { ZONAS, BARRIOS, LOCS } from "./data";

export function norm(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function fmtMoney(v?: number): string {
  if (v === undefined || v === null || isNaN(v)) return "N/D";
  return `$${(v * 1000000).toLocaleString("es-CO")}`;
}

export function findZone(query: string): Zone | null {
  const q = norm(query);
  if (!q) return null;

  // Let's first search by explicit matches in zone names
  for (const z of ZONAS) {
    if (q.includes(norm(z.nombre)) || norm(z.nombre).includes(q)) {
      return z;
    }
  }

  // Then search in upz or keys
  for (const z of ZONAS) {
    const keys = norm(z.keys || "") + " " + norm(z.nombre) + " " + norm(z.localidad);
    if (keys.includes(q)) {
      return z;
    }
  }

  // Try partial match on localidad
  for (const z of ZONAS) {
    if (q.includes(norm(z.localidad)) || norm(z.localidad).includes(q)) {
      return z;
    }
  }

  return null;
}

export function vectorFor(zone: Zone): "norte" | "centro" | "occidente" | null {
  if (!zone) return null;
  const n = norm((zone.nombre || "") + " " + (zone.upz || "") + " " + (zone.localidad || ""));
  if (
    n.includes("usaquen") ||
    n.includes("suba") ||
    n.includes("cedritos") ||
    n.includes("santa barbara") ||
    n.includes("colina")
  ) {
    return "norte";
  }
  if (
    n.includes("chapinero") ||
    n.includes("teusaquillo") ||
    n.includes("chico") ||
    n.includes("rosales") ||
    n.includes("santa fe")
  ) {
    return "centro";
  }
  if (
    n.includes("fontibon") ||
    n.includes("kennedy") ||
    n.includes("modelia") ||
    n.includes("salitre") ||
    n.includes("bavaria")
  ) {
    return "occidente";
  }
  return null;
}

export async function geocode(address: string): Promise<GeocodeResult | null> {
  const q = encodeURIComponent(address + ", Bogotá, Colombia");
  const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=co&limit=3&addressdetails=0&q=${q}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "add-proptech-agent/1.0"
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding failed, trying simpler query", error);
    return null;
  }
}

export function getLocalidadFromNomenclature(address: string): string | null {
  const normAddress = norm(address);

  // Specific high-frequency avenues/barrios/keywords in Suba/Usaquén/Chapinero
  if (
    normAddress.includes("avenida suba") || 
    normAddress.includes("av suba") ||
    normAddress.includes("portal suba") ||
    normAddress.includes("imperial suba") ||
    normAddress.includes("colina campestre") ||
    normAddress.includes("niza") ||
    normAddress.includes("boyaca") ||
    normAddress.includes("las villas") ||
    normAddress.includes("villas de granada") ||
    normAddress.includes("portales del norte") ||
    normAddress.includes("mazuren") ||
    normAddress.includes("san jose de bavaria") ||
    normAddress.includes("prado veraniego") ||
    normAddress.includes("batan") ||
    normAddress.includes("cantagallo") ||
    normAddress.includes("iberia") ||
    normAddress.includes("britalia") ||
    normAddress.includes("mirandela") ||
    normAddress.includes("compartir suba") ||
    normAddress.includes("tibabuyes") ||
    normAddress.includes("pasadena") ||
    normAddress.includes("estoril") ||
    normAddress.includes("alhambra")
  ) {
    return "Suba";
  }

  if (
    normAddress.includes("cedritos") ||
    normAddress.includes("santa barbara") ||
    normAddress.includes("usaquen") ||
    normAddress.includes("unicentro") ||
    normAddress.includes("hacienda santa barbara") ||
    normAddress.includes("san patricio") ||
    normAddress.includes("bella suiza") ||
    normAddress.includes("cantalejo") ||
    normAddress.includes("san cristobal norte") ||
    normAddress.includes("verbenal") ||
    normAddress.includes("toberin") ||
    normAddress.includes("san antonio norte") ||
    normAddress.includes("tibabita") ||
    normAddress.includes("santa ana") ||
    normAddress.includes("la calleja") ||
    normAddress.includes("country club")
  ) {
    return "Usaquén";
  }

  if (
    normAddress.includes("chico") ||
    normAddress.includes("rosales") ||
    normAddress.includes("chapinero") ||
    normAddress.includes("zona g") ||
    normAddress.includes("zona t") ||
    normAddress.includes("andino") ||
    normAddress.includes("el retiro") ||
    normAddress.includes("antiguo country") ||
    normAddress.includes("el refugio")
  ) {
    return "Chapinero";
  }

  // Regex-based standard grid extractor
  const clMatch = normAddress.match(/(?:calle|cll|cl|cl\s*e|cale)\s*(\d+)/i);
  const crMatch = normAddress.match(/(?:carrera|cra|cr|kr|krra|carera)\s*(\d+)/i);

  let clNum: number | null = null;
  let crNum: number | null = null;

  if (clMatch) clNum = parseInt(clMatch[1], 10);
  if (crMatch) crNum = parseInt(crMatch[1], 10);

  if (!clNum && !crNum) {
    // Implicit hash pattern: e.g. "140 # 9-50"
    const hashMatch = normAddress.match(/(\d+)\s*(?:#|no|num|numero)\s*(\d+)/i);
    if (hashMatch) {
      clNum = parseInt(hashMatch[1], 10);
      crNum = parseInt(hashMatch[2], 10);
    }
  } else if (clNum && !crNum) {
    // Only Calle matched, extract cross Carrera: e.g. "Calle 140 # 9"
    const crossMatch = normAddress.match(/(?:#|no|num|numero)\s*(\d+)/i);
    if (crossMatch) {
      crNum = parseInt(crossMatch[1], 10);
    }
  } else if (!clNum && crNum) {
    // Only Carrera matched, extract cross Calle: e.g. "Carrera 15 # 116"
    const crossMatch = normAddress.match(/(?:#|no|num|numero)\s*(\d+)/i);
    if (crossMatch) {
      clNum = parseInt(crossMatch[1], 10);
    }
  }

  if (clNum && crNum) {
    // North of Calle 100, the divide is Autopista Norte (approx. Carrera 45)
    if (clNum >= 100 && clNum <= 245) {
      if (crNum > 45) {
        return "Suba";
      } else if (crNum > 0 && crNum <= 45) {
        return "Usaquén";
      }
    } else if (clNum > 72 && clNum < 100) {
      if (crNum > 0 && crNum <= 20) {
        return "Chapinero";
      }
    } else if (clNum >= 39 && clNum < 72) {
      if (crNum > 0 && crNum <= 20) {
        return "Chapinero";
      }
    } else if (clNum >= 22 && clNum <= 30) {
      if (crNum >= 50 && crNum <= 68) {
        return "Teusaquillo";
      } else if (crNum > 68 && crNum <= 86) {
        return "Fontibón";
      }
    }
  }

  return null;
}

export function nearestBarrio(lat: number, lon: number): { barrio: string; localidad: string } | null {
  if (!BARRIOS || BARRIOS.length === 0) return null;
  
  let best: BarrioCoord | null = null;
  let bestDist = 1e9;

  for (const b of BARRIOS) {
    const dLat = lat - b.lat;
    const dLon = lon - b.lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < bestDist) {
      bestDist = dist;
      best = b;
    }
  }

  if (best) {
    const locIndex = best.localidadIndex;
    let localidadName = LOCS[locIndex] || "Bogotá";

    // 1. Strict mathematical split for North of Calle 100 (lat >= 4.685)
    // Autopista Norte is a slightly diagonal boundary line that divides Suba (West) and Usaquén (East)
    if (lat >= 4.685 && lat < 4.85) {
      // Precise line formula sourced from frontier coordinates:
      // boundaryLon = -74.0556 at lat=4.685 (Calle 100)
      // boundaryLon = -74.0311 at lat=4.820 (Guaymaral/Torca)
      const boundaryLon = -74.0556 + (lat - 4.685) * 0.1822;

      if (lon < boundaryLon) {
        localidadName = "Suba";
      } else {
        localidadName = "Usaquén";
      }
    }

    // 2. Strict transition for Chapinero (East of Autopista Norte / Avenida Caracas between Calle 72 and 100)
    if (lat >= 4.645 && lat < 4.685) {
      if (lon >= -74.062) {
        localidadName = "Chapinero";
      }
    }

    // 3. Natural wetland barrier: Suba vs Engativá (Río Juan Amarillo / Humedal Tibabuyes)
    // Approx lat 4.717 is the natural curve separating Suba (North) from Engativá Bolivia (South)
    if (lon <= -74.08 && lat >= 4.700 && lat < 4.730) {
      if (lat < 4.717) {
        localidadName = "Engativá";
      } else {
        localidadName = "Suba";
      }
    }

    return {
      barrio: best.nombre,
      localidad: localidadName
    };
  }

  return null;
}
