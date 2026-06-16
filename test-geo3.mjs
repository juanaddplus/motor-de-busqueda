import { getLocalidadFromNomenclature, nearestBarrio } from './src/utils.ts';
import { geocode, findZone } from './src/utils.ts';

async function t() {
  const q = "CAlle 19 # 83-25";
  const coords = await geocode(q);
  console.log("coords", coords);
  if (coords) {
     const nb = nearestBarrio(coords.lat, coords.lon);
     console.log("nearestBarrio", nb);
  }
  
  console.log("nomm", getLocalidadFromNomenclature(q));
  console.log("fallbackZone:", findZone(getLocalidadFromNomenclature(q) || q)?.nombre);
}
t();
