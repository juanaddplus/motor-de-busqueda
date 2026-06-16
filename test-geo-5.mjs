import { getLocalidadFromNomenclature, findZone, nearestBarrio } from './src/utils.ts';
import { geocode } from './src/utils.ts';

async function test() {
  const q = "Calle 12 # 5-22";
  const explicitLoc = getLocalidadFromNomenclature(q);
  console.log("explicitLoc:", explicitLoc);
  
  if (explicitLoc) {
    const fallbackZone = findZone(explicitLoc);
    console.log("fallbackZone based on explicitLoc:", fallbackZone?.nombre);
  }
}
test();
