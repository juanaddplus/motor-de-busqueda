import { findZone } from './src/utils.ts';

const z = findZone("usaquen");
console.log(z?.nombre, z?.localidad);

const z2 = findZone("Usaquén");
console.log(z2?.nombre, z2?.localidad);
