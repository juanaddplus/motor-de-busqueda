import { getLocalidadFromNomenclature, nearestBarrio } from './src/utils.ts';
import { geocode } from './src/utils.ts';

async function t() {
  const q = "Carrera 17 a # 175-82";
  const coords = await geocode(q);
  console.log("coords", coords);
  if (coords) {
     const nb = nearestBarrio(coords.lat, coords.lon);
     console.log("nearestBarrio", nb);
  }
}
t();
