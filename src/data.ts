import { Zone, BarrioCoord } from "./types";

export const LOCS = [
  "Antonio Nariño",
  "Barrios Unidos",
  "Bosa",
  "Chapinero",
  "Ciudad Bolívar",
  "Engativá",
  "Fontibón",
  "Kennedy",
  "La Candelaria",
  "Los Mártires",
  "Puente Aranda",
  "Rafael Uribe Uribe",
  "San Cristóbal",
  "Santa Fe",
  "Suba",
  "Sumapaz",
  "Teusaquillo",
  "Tunjuelito",
  "Usaquén",
  "Usme"
];

export const ZONAS: Zone[] = [
  {
    keys: "chico rosales upz 88 97 chapinero",
    nombre: "Chicó / Rosales",
    upz: "88/97",
    localidad: "Chapinero",
    precio_m2: 8.90,
    trafico: 12.0,
    walkscore: 95,
    perfil: "Trofeo Patrimonial / Cúpula empresarial, diplomáticos de embajadas, familias de legado e inversores de preservación de riqueza.",
    infra: "Renovación paisajística y peatonal de la Carrera 11, conexión de ciclorrutas de borde oriental.",
    salud: "Clínica del Country, Clínica de la Mujer",
    comercio: "CC Andino, CC El Retiro, CC Atlantis Plaza, Zona T"
  },
  {
    keys: "usaquen santa ana upz 14",
    nombre: "Usaquén / Santa Ana",
    upz: "14",
    localidad: "Usaquén",
    precio_m2: 8.50,
    trafico: 14.0,
    walkscore: 85,
    perfil: "Preservación de Capital / Baja Rotación. Atrae a inversores de alto patrimonio, canles diplomáticos, ejecutivos multinacionales y familias tradicionales.",
    infra: "Regiotram del Norte parallel to Carrera 9, future connection with L1 Metro (106), and Carrera 7 upgrades.",
    salud: "Fundación Santa Fe de Bogotá, Clínica Santa Ana",
    comercio: "Hacienda Santa Bárbara, Mercado de Pulgas de Usaquén, clúster gastronómico"
  },
  {
    keys: "santa barbara upz 11 usaquen",
    nombre: "Santa Bárbara",
    upz: "11",
    localidad: "Usaquén",
    precio_m2: 7.30,
    trafico: 18.0,
    walkscore: 92,
    perfil: "Rentabilidad Moderada / Alta Liquidez. Dirigido a profesionales corporativos, ejecutivos de mando alto y parejas DINK (Double Income, No Kids).",
    infra: "Megaobra Troncal TransMilenio Av. 68 / Calle 100, adding 542,000 sqm of pedestrian space.",
    salud: "Clínica Reina Sofía, Clínica Santa Bárbara, centros médicos de la Calle 127",
    comercio: "Centro Comercial Unicentro, Hacienda Santa Ana"
  },
  {
    keys: "cedritos upz 07 usaquen",
    nombre: "Cedritos",
    upz: "07",
    localidad: "Usaquén",
    precio_m2: 7.40,
    trafico: 15.0,
    walkscore: 88,
    perfil: "Apreciación Constante / Demanda Masiva. Primeros compradores hipotecarios, profesionales tecnológicos e inversionistas de mediana estancia.",
    infra: "Ampliación de la Avenida Carrera 9 (NQS) and Calle 153, plus perimetral effect of Regiotram.",
    salud: "Clínica El Bosque, CAPS Cedritos",
    comercio: "Eje Comercial de la 140, Centro Comercial Palatino, Cedritos 151"
  },
  {
    keys: "chapinero central upz 90",
    nombre: "Chapinero Central",
    upz: "90",
    localidad: "Chapinero",
    precio_m2: 7.80,
    trafico: 16.0,
    walkscore: 98,
    perfil: "Alto Retorno (Renta Corta/Media Estancia). Nómadas digitales, Slow Travelers, estudiantes y operadores Pro+ de arriendo fraccionado.",
    infra: "Primera Línea del Metro (elevada Av. Caracas y estación cl. 72), integration works and full corridor renewal.",
    salud: "Hospital Universitario San Ignacio, Clínica Marly",
    comercio: "Hub Gastronómico Zona G, CC Avenida Chile, teatros independientes y de cultura"
  },
  {
    keys: "salitre occidental upz 110 fontibon",
    nombre: "Salitre Occidental",
    upz: "110",
    localidad: "Fontibón",
    precio_m2: 7.90,
    trafico: 20.0,
    walkscore: 80,
    perfil: "Estabilidad Corporativa / Demanda Cautiva. Empleados de corporaciones multinacionales del eje Calle 26, sector aeronáutico y familias consolidadas.",
    infra: "Regiotram de Occidente (patio taller), Troncal TransMilenio Av. 68 y optimización Av. El Dorado.",
    salud: "Clínica Universitaria Colombia (Colsanitas)",
    comercio: "CC Salitre Plaza, CC Plaza Claro, cercanía a Gran Estación"
  },
  {
    keys: "parque salitre upz 103 teusaquillo",
    nombre: "Parque Salitre",
    upz: "103",
    localidad: "Teusaquillo",
    precio_m2: 7.90,
    trafico: 20.0,
    walkscore: 80,
    perfil: "Estabilidad Corporativa / Demanda Cautiva. Inversionistas de arrendamiento, altos funcionarios públicos y personal corporativo.",
    infra: "Primera Línea del Metro de Bogotá (Estaciones Calle 26 y NQS), Troncal de la 68",
    salud: "Clínica Colombia, CAPS Gran Estación",
    comercio: "Centro Comercial Gran Estación"
  },
  {
    keys: "suba imperial compartir upz 71 suba",
    nombre: "Suba Imperial / Compartir",
    upz: "71",
    localidad: "Suba",
    precio_m2: 5.40,
    trafico: 12.0,
    walkscore: 75,
    perfil: "Alta Rentabilidad (VIS/No VIS) / Volumen. Familias tradicionales de clase media, comerciantes locales e hipotecas respaldadas por subsidios.",
    infra: "Línea 2 del Metro de Bogotá (Estaciones subterráneas), ampliación Av. Ciudad de Cali.",
    salud: "Hospital de Suba, Clínica Juan N. Corpas",
    comercio: "Centro Comercial Plaza Imperial, Centro Suba, Éxito Suba"
  },
  {
    keys: "colina campestre san jose de bavaria upz 105 suba",
    nombre: "Colina Campestre / San José de Bavaria",
    upz: "105",
    localidad: "Suba",
    precio_m2: 6.70,
    trafico: 16.0,
    walkscore: 65,
    perfil: "Retorno a Largo Plazo / Usuario Final. Familias de estrato 5 en expansión, ejecutivos senior buscando modelos tipo Club House.",
    infra: "Ampliación de la Calle 153 (Avenida Sirena), puentes vehiculares sobre Autopista Norte y mejoras Av. Boyacá.",
    salud: "Clínica La Colina",
    comercio: "Centro Comercial Parque La Colina, Portoalegre, Bulevar Niza"
  },
  {
    keys: "fontibon tradicional upz 75",
    nombre: "Fontibón Tradicional",
    upz: "75",
    localidad: "Fontibón",
    precio_m2: 5.01,
    trafico: 25.0,
    walkscore: 80,
    perfil: "Comerciantes locales, inversionistas de vivienda VIS e interés social",
    infra: "Corredor Nueva Calle 13, Regiotram de Occidente",
    salud: "Hospital de Fontibón, Clínica Partenón",
    comercio: "Multiplaza, Centro Comercial Hayuelos"
  },
  {
    keys: "modelia upz 114 fontibon",
    nombre: "Modelia",
    upz: "114",
    localidad: "Fontibón",
    precio_m2: 5.10,
    trafico: 25.0,
    walkscore: 85,
    perfil: "Profesionales de logística y aviación, familias de arraigo comercial",
    infra: "Corredor Nueva Calle 13, Conexión Troncal Avenida 68",
    salud: "Clínica Colombia, Centro Médico Fontibón",
    comercio: "CC Hayuelos, CC Multiplaza"
  },
  {
    keys: "carvajal upz 45 kennedy",
    nombre: "Carvajal",
    upz: "45",
    localidad: "Kennedy",
    precio_m2: 3.82,
    trafico: 18.0,
    walkscore: 75,
    perfil: "Comerciantes mayoristas, empresarios industriales y constructores",
    infra: "L1 Metro (Estación Avenida 1 de Mayo), Troncal Avenida 68",
    salud: "Hospital del Sur, Clínica de Occidente",
    comercio: "Centro Comercial Plaza de las Américas, Outlet de las Américas"
  },
  {
    keys: "kennedy central upz 47",
    nombre: "Kennedy Central",
    upz: "47",
    localidad: "Kennedy",
    precio_m2: 3.82,
    trafico: 18.0,
    walkscore: 80,
    perfil: "Familias tradicionales, microempresarios independientes",
    infra: "Primera Línea del Metro de Bogotá, Intercambiador Vial Bosa",
    salud: "Hospital Occidente de Kennedy",
    comercio: "CC Plaza de las Américas, Tintal Plaza"
  },
  {
    keys: "bavaria alsacia upz 113 kennedy",
    nombre: "Bavaria / Alsacia",
    upz: "113",
    localidad: "Kennedy",
    precio_m2: 4.67,
    trafico: 18.0,
    walkscore: 82,
    perfil: "Jóvenes compradores, directos de entidades gubernamentales o financieras",
    infra: "Troncal Avenida 68, Ampliación de la Avenida Ciudad de Cali",
    salud: "Clínica de Occidente, Hospital de Kennedy",
    comercio: "Centro Comercial El Edén, Eje de Servicios de la Boyacá"
  },
  {
    keys: "centro internacional upz 93 santa fe",
    nombre: "Centro Internacional",
    upz: "93",
    localidad: "Santa Fe",
    precio_m2: 5.10,
    trafico: 16.4,
    walkscore: 98,
    perfil: "Estudiantes, creativos y nómadas digitales, inversores de renta líquida",
    infra: "L1 Metro de Bogotá, Plan Parcial de Renovación San Victorino",
    salud: "Hospital Universitario San José, Clínica de Marly",
    comercio: "Centro Comercial San Martín, Gran San Victorino"
  },
  {
    keys: "antonio narino restrepo santander upz 38",
    nombre: "Antonio Nariño (Restrepo / Santander)",
    upz: "38",
    localidad: "Antonio Nariño",
    precio_m2: 4.25,
    trafico: 18.2,
    walkscore: 84,
    perfil: "Comerciantes de calzado, microempresarios y familias tradicionales de arraigo laboral",
    infra: "L1 Metro (Estación Av. 1 de Mayo-Restrepo), Reconfiguración Troncal Caracas",
    salud: "CAPS Antonio Nariño, Policlínico del Olaya",
    comercio: "Eje Comercial del Calzado Restrepo, CC Centro Mayor"
  },
  {
    keys: "barrios unidos polo club castellana floresta upz 22",
    nombre: "Barrios Unidos (Polo Club / La Castellana)",
    upz: "22",
    localidad: "Barrios Unidos",
    precio_m2: 6.95,
    trafico: 22.4,
    walkscore: 91,
    perfil: "Profesionales independientes, oficinas boutique, MIPYMEs de servicios y consultorios",
    infra: "Ampliación Troncal NQS, Conexión Avenida 68 y red densa de ciclorrutas",
    salud: "Clínica Calle 100, CAPS Barrios Unidos, IPS Cafam",
    comercio: "Eje del Mueble de la 12, CC Iserra 100, CC Cafam Floresta"
  },
  {
    keys: "bosa central recreo metrovivienda upz 86",
    nombre: "Bosa (Bosa Central / El Recreo)",
    upz: "86",
    localidad: "Bosa",
    precio_m2: 2.85,
    trafico: 19.5,
    walkscore: 74,
    perfil: "Compradores primerizos, trabajadores industriales, microempresarios autónomos",
    infra: "L2 Metro (Estación Bosa Portal), Intercambiador y Vía Bici de Tintal",
    salud: "Hospital de Bosa (Nuevo de Alta Complejidad), CAPS Metrovivienda",
    comercio: "CC Gran Plaza Bosa, Centro Comercial El Ensueño, Éxito Bosa"
  },
  {
    keys: "engativa alamos quirigua villas granada upz 73",
    nombre: "Engativá (Álamos / Quirigua / Villas de Granada)",
    upz: "73",
    localidad: "Engativá",
    precio_m2: 4.12,
    trafico: 24.1,
    walkscore: 79,
    perfil: "Trabajadores y profesionales del Aeropuerto El Dorado, familias de clase media consolidada",
    infra: "Ampliación de la Avenida Mutis (Calle 63), Troncal de la Cali",
    salud: "Hospital de Engativá, Clínica Partenón, CAPS Boyacá Real",
    comercio: "CC Portal 80, CC Diverplaza, Éxito de la 80"
  },
  {
    keys: "martires ricaurte paloquemao upz 102",
    nombre: "Los Mártires (Ricaurte / Paloquemao)",
    upz: "102",
    localidad: "Los Mártires",
    precio_m2: 3.90,
    trafico: 15.3,
    walkscore: 82,
    perfil: "Comerciantes mayoristas de marroquinería y autopartes, distribuidores industriales",
    infra: "L1 Metro (Estación Calle 26), Troncal NQS y renovación de la Estación Sabana",
    salud: "Hospital Universitario San José, Clínica Méderi",
    comercio: "Plaza de Paloquemao, San Andresito San José, San Victorino"
  },
  {
    keys: "puente aranda montes alqueria upz 43",
    nombre: "Puente Aranda (Ciudad Montes / Alquería)",
    upz: "43",
    localidad: "Puente Aranda",
    precio_m2: 4.38,
    trafico: 19.8,
    walkscore: 83,
    perfil: "Microempresarios del calzado y textiles, profesionales juniors corporativos",
    infra: "L1 Metro (Estación NQS-Fucha), Troncal de la 68 and renovación del Parque Industrial",
    salud: "Hospital del Sur, Clínica Colombia IPS",
    comercio: "CC Centro Mayor, Eje Textilera de la Alquería, Outlets de las Américas"
  },
  {
    keys: "rafael uribe quiroga claret upz 36",
    nombre: "Rafael Uribe Uribe (Quiroga / Claret)",
    upz: "36",
    localidad: "Rafael Uribe Uribe",
    precio_m2: 3.20,
    trafico: 16.5,
    walkscore: 81,
    perfil: "Funcionarios estatales, docentes de colegios públicos, pequeños comerciantes",
    infra: "L1 Metro (Estación Olaya), Regeneración integral del Eje Caracas",
    salud: "Hospital San Carlos, Centro Policlínico del Olaya",
    comercio: "Eje Comercial de la Avenida Gaitán Cortés, CC Centro Mayor"
  },
  {
    keys: "cristobal veinte julio san blas upz 33",
    nombre: "San Cristóbal (Veinte de Julio / San Blas)",
    upz: "33",
    localidad: "San Cristóbal",
    precio_m2: 3.10,
    trafico: 15.1,
    walkscore: 78,
    perfil: "Artesanos, operarios y familias raizales autónomas",
    infra: "TransMiCable San Cristóbal (Estación 20 de Julio), Canalización río Fucha",
    salud: "Hospital San Blas, CAPS Primero de Mayo, IPS San Cristóbal",
    comercio: "Santuario and Eje Comercial del 20 de Julio, CC Altavista"
  },
  {
    keys: "tunjuelito venecia tunal upz 42",
    nombre: "Tunjuelito (Venecia / El Tunal)",
    upz: "42",
    localidad: "Tunjuelito",
    precio_m2: 3.35,
    trafico: 17.2,
    walkscore: 80,
    perfil: "Comerciantes del sector automotriz y del plástico, asalariados públicos",
    infra: "Troncal Avenida 68, Ampliación del Tunal y de la Autopista Sur",
    salud: "Hospital de Meissen (Expansión), CAPS El Tunal",
    comercio: "CC Ciudad Tunal, Zona de Comercio Activo de Venecia"
  },
  {
    keys: "usme santa librada yomasa alfonso lopez upz 56",
    nombre: "Usme (Santa Librada / Alfonso López)",
    upz: "56",
    localidad: "Usme",
    precio_m2: 2.60,
    trafico: 22.1,
    walkscore: 68,
    perfil: "Primeros compradores, beneficiarios de subsidios de vivienda y VIS",
    infra: "Ampliación de la Troncal Caracas Sur, Portal Usme extendido",
    salud: "Hospital de Usme (Nuevo Complejo de Especialidades Médicas)",
    comercio: "Centro Comercial AltavistaUsme, Ejes de servicio locales"
  }
];

export interface InfraProject {
  id: string;
  name: string;
  type: string;
  localities: string[];
  impact_desc: string;
  progress: number;
}

export const INFRA_PROJECTS: InfraProject[] = [
  { id: "L1", name: "Primera Línea del Metro", type: "Metro", localities: ["Bosa", "Kennedy", "Puente Aranda", "Los Mártires", "Santa Fe", "Chapinero", "Teusaquillo", "Barrios Unidos", "Antonio Nariño"], impact_desc: "Eje estructurante sur-norte que detona alta valorización en estaciones principales.", progress: 77.5 },
  { id: "L2", name: "Segunda Línea del Metro", type: "Metro", localities: ["Chapinero", "Barrios Unidos", "Engativá", "Suba"], impact_desc: "Solución subterránea que habilitará rentismo de corta estancia y conexión aeroportuaria.", progress: 15.0 },
  { id: "T68", name: "Troncal Metropolitana Avenida 68", type: "TransMilenio", localities: ["Tunjuelito", "Kennedy", "Puente Aranda", "Fontibón", "Engativá", "Teusaquillo", "Barrios Unidos", "Suba", "Usaquén"], impact_desc: "Anillo alimentador circular con mayor plusvalía por metro cuadrado.", progress: 90.0 },
  { id: "R_OCC", name: "Regiotram de Occidente", type: "Regiotram", localities: ["Fontibón", "Puente Aranda", "Los Mártires", "Santa Fe"], impact_desc: "Conexión férrea rápida intermunicipal; incrementa demanda institucional.", progress: 45.0 },
  { id: "R_NORTE", name: "Regiotram del Norte", type: "Regiotram", localities: ["Usaquén", "Suba", "Chapinero", "Barrios Unidos", "Teusaquillo"], impact_desc: "Proyecto de tren ligero clave para el borde oriental norte.", progress: 12.0 },
  { id: "AV_CALI", name: "Troncal Ciudad de Cali", type: "TransMilenio", localities: ["Bosa", "Kennedy", "Suba"], impact_desc: "Descongestión del borde occidental y reurbanización de predios masivos.", progress: 65.0 },
  { id: "CL_13", name: "Nueva Calle 13", type: "Vial", localities: ["Fontibón", "Puente Aranda"], impact_desc: "Optimización logística e incremento dramático en valores de suelo industrial/comercial.", progress: 25.0 }
];

export function getInfraForLocalidad(localidad: string): InfraProject[] {
  const norm = localidad.toLowerCase().trim();
  const dbMatch = LOCALIDADES_DB.find(l => l.nombre.toLowerCase() === norm);
  
  if (dbMatch && dbMatch.megaobras_infraestructura) {
    // If strict locality data exists, ONLY match projects explicitly mentioned
    return INFRA_PROJECTS.filter(p => {
      // Check if any megaobra in dbMatch matches the project name (partial or exact)
      return dbMatch.megaobras_infraestructura.some(megaobraName => 
        p.name.toLowerCase().includes(megaobraName.toLowerCase().replace("de bogotá", "").trim()) ||
        megaobraName.toLowerCase().includes(p.name.toLowerCase())
      );
    });
  }

  // Fallback for localities not in our strict deep research DB
  return INFRA_PROJECTS.filter(p => p.localities.some(l => l.toLowerCase() === norm));
}

// Reconstructed compact high fidelity representation of Bogotá neighborhood coords (GEO.b)
// Packaged beautifully to preserve geocoding without overwhelming memory limit
export const BARRIOS: BarrioCoord[] = [
  ...[
    ["GUAYMARAL", 14, 4.8237, -74.0737],
    ["CASABLANCA SUBA II", 14, 4.8286, -74.0523],
    ["TORCA I", 14, 4.8129, -74.0329],
    ["CASABLANCA SUBA URBANO", 14, 4.8037, -74.0459],
    ["LA CANDELARIA", 14, 4.8049, -74.0757],
    ["CONEJERA", 14, 4.8036, -74.0633],
    ["TUNA RURAL", 14, 4.7803, -74.1095],
    ["TIBABITA", 18, 4.7648, -74.028],
    ["BUENAVISTA", 18, 4.7665, -74.0256],
    ["MIRANDELA", 14, 4.7665, -74.0508],
    ["SAN JOSE DE BAVARIA", 14, 4.7647, -74.0631],
    ["VERBENAL SAN ANTONIO", 14, 4.7637, -74.0346],
    ["NUEVA ZELANDIA", 14, 4.7588, -74.0477],
    ["VILLA DEL PRADO", 14, 4.7562, -74.0531],
    ["TIBABUYES II", 14, 4.7574, -74.1163],
    ["IRAGUA", 14, 4.7595, -74.0671],
    ["TUNA BAJA", 14, 4.7571, -74.0925],
    ["SAN JOSE DE USAQUEN", 18, 4.7548, -74.0303],
    ["SAN ANTONIO NORTE", 18, 4.7576, -74.0274],
    ["VILLA HERMOSA", 14, 4.757, -74.0905],
    ["SALITRE SUBA", 14, 4.7554, -74.0829],
    ["PINOS DE LOMBARDIA", 14, 4.7535, -74.0959],
    ["PORTALES DEL NORTE", 14, 4.751, -74.0639],
    ["LA URIBE", 18, 4.7532, -74.0404],
    ["EL REDIL", 18, 4.7529, -74.0232],
    ["BRITALIA", 14, 4.7474, -74.0543],
    ["SABANA DE TIBABUYES", 14, 4.7495, -74.109],
    ["TOBERIN", 18, 4.746, -74.0407],
    ["LOMBARDIA", 14, 4.7475, -74.1017],
    ["CEDRITOS", 18, 4.7181, -74.0351],
    ["CANTAGALLO", 14, 4.7438, -74.0559],
    ["LA GAITANA", 14, 4.7419, -74.1082],
    ["VILLA MARIA", 14, 4.7401, -74.1016],
    ["SAN CRISTOBAL NORTE", 18, 4.7389, -74.0253],
    ["ESTRELLA DEL NORTE", 18, 4.7384, -74.0424],
    ["COSTA AZUL", 14, 4.7386, -74.097],
    ["MAZUREN", 14, 4.7364, -74.0561],
    ["VILLA ELISA", 14, 4.7353, -74.0898],
    ["LAS MARGARITAS", 18, 4.735, -74.0446],
    ["BARRANCAS NORTE", 18, 4.7349, -74.0275],
    ["AURES", 14, 4.7332, -74.0952],
    ["CAOBOS SALAZAR", 18, 4.7294, -74.037],
    ["VICTORIA NORTE", 18, 4.7319, -74.0559],
    ["BARRANCAS", 18, 4.7309, -74.0274],
    ["EL RINCON NORTE", 14, 4.7283, -74.0906],
    ["PRADO PINZON", 18, 4.7286, -74.054],
    ["LOS CEDROS", 18, 4.7241, -74.0456],
    ["LOS NARANJOS", 14, 4.7245, -74.0855],
    ["SAN JOSE DEL PRADO", 18, 4.7232, -74.0591],
    ["ACACIAS USAQUEN", 18, 4.7233, -74.0339],
    ["EL RINCON", 5, 4.7223, -74.0925],
    ["CIUDAD JARDIN NORTE", 14, 4.7228, -74.0707],
    ["EL GACO", 5, 4.7236, -74.1381],
    ["BOLIVIA ORIENTAL", 5, 4.7195, -74.1095],
    ["LOS CEDROS ORIENTAL", 18, 4.7232, -74.0287],
    ["CEDRO NARVAEZ", 18, 4.7211, -74.0334],
    ["EL CONTADOR", 18, 4.7202, -74.0436],
    ["PRADO VERANIEGO NORTE", 18, 4.7215, -74.0614],
    ["CIUDAD HUNZA", 5, 4.7207, -74.0867],
    ["BOCHICA II", 5, 4.7167, -74.1085],
    ["VILLAS DE GRANADA I", 5, 4.7175, -74.1207],
    ["BOLIVIA", 5, 4.7191, -74.1137],
    ["PRADO VERANIEGO", 18, 4.718, -74.0553],
    ["NIZA NORTE", 5, 4.7149, -74.0761],
    ["LAS VILLAS", 18, 4.7156, -74.0717],
    ["LA CALLEJA", 18, 4.7103, -74.0474],
    ["GARCES NAVAS", 5, 4.7127, -74.1195],
    ["QUIRIGUA", 5, 4.7107, -74.1018],
    ["LA CAROLINA", 18, 4.7076, -74.0364],
    ["BELLA SUIZA", 18, 4.7067, -74.0298],
    ["BATAN", 18, 4.7061, -74.0641],
    ["NIZA SUR", 5, 4.7042, -74.0763],
    ["ALAMOS", 5, 4.705, -74.1184],
    ["PARIS", 5, 4.7034, -74.1057],
    ["SANTA BARBARA OCCIDENTAL", 18, 4.7025, -74.0481],
    ["MONACO", 18, 4.7012, -74.0637],
    ["FLORENCIA", 5, 4.6994, -74.1072],
    ["SANTA BARBARA CENTRAL", 18, 4.7004, -74.0372],
    ["SANTA BARBARA ORIENTAL", 18, 4.6978, -74.0319],
    ["LA GRANJA", 5, 4.6988, -74.0971],
    ["PUENTE LARGO", 1, 4.6975, -74.0656],
    ["LOS ALAMOS", 5, 4.6978, -74.1112],
    ["SAN PATRICIO", 18, 4.6951, -74.0485],
    ["FLORIDA BLANCA", 5, 4.6955, -74.1144],
    ["USAQUEN", 18, 4.6934, -74.0282],
    ["PASADENA", 1, 4.6931, -74.063],
    ["ESTORIL", 18, 4.6947, -74.0579],
    ["MOLINOS NORTE", 18, 4.693, -74.0399],
    ["ANDES NORTE", 1, 4.6911, -74.0677],
    ["BONANZA", 1, 4.6916, -74.0896],
    ["SANTA ANA OCCIDENTAL", 18, 4.6898, -74.0359],
    ["SANTA BIBIANA", 18, 4.6888, -74.0501],
    ["LAS FERIAS OCCIDENTAL", 1, 4.6866, -74.0872],
    ["SANTA ANA", 18, 4.686, -74.0302],
    ["RINCON DEL CHICO", 18, 4.6858, -74.0451],
    ["VILLA LUZ", 5, 4.6845, -74.1068],
    ["LOS ANDES", 1, 4.6858, -74.0711],
    ["RIONEGRO", 1, 4.6829, -74.066],
    ["LA CASTELLANA", 3, 4.6809, -74.0618],
    ["LAS FERIAS", 1, 4.6824, -74.0844],
    ["CHICO NORTE III SECTOR", 3, 4.6827, -74.0523],
    ["CHICO NORTE II SECTOR", 3, 4.6804, -74.0437],
    ["METROPOLIS", 1, 4.6805, -74.0824],
    ["LA ESTRADA", 1, 4.6767, -74.0934],
    ["SIMON BOLIVAR", 1, 4.679, -74.0797],
    ["CHICO NORTE", 3, 4.6778, -74.0489],
    ["POLO CLUB", 3, 4.675, -74.0614],
    ["EL CHICO", 3, 4.6732, -74.0508],
    ["LA PATRIA", 3, 4.6772, -74.064],
    ["SAN FERNANDO OCCIDENTAL", 1, 4.6763, -74.0825],
    ["ANTIGUO COUNTRY", 3, 4.6718, -74.0568],
    ["DOCE DE OCTUBRE", 1, 4.6678, -74.0755],
    ["BOSQUE POPULAR", 1, 4.671, -74.0955],
    ["SANTA SOFIA", 3, 4.6711, -74.0673],
    ["NORMANDIA", 1, 4.669, -74.1056],
    ["EL REFUGIO", 3, 4.6673, -74.0429],
    ["LA CABRERA", 3, 4.6691, -74.0493],
    ["MODELIA", 1, 4.6677, -74.1149],
    ["EL RETIRO", 3, 4.6666, -74.052],
    ["LAGO GAITAN", 3, 4.6666, -74.0583],
    ["ALCAZARES", 3, 4.6626, -74.0698],
    ["LOS ROSALES", 3, 4.6593, -74.0479],
    ["PORCIUNCULA", 3, 4.6588, -74.0572],
    ["SIETE DE AGOSTO", 3, 4.6574, -74.0707],
    ["QUINTA CAMACHO", 3, 4.654, -74.0591],
    ["SALITRE OCCIDENTAL", 16, 4.6518, -74.1092],
    ["EL SALITRE", 16, 4.6524, -74.098],
    ["PABLO VI NORTE", 16, 4.6544, -74.0872],
    ["NICOLAS DE FEDERMAN", 16, 4.6457, -74.0814],
    ["CHAPINERO CENTRAL", 3, 4.6455, -74.0625],
    ["MODELIA OCCIDENTAL", 6, 4.6681, -74.1255],
    ["BAVARIA", 7, 4.6378, -74.139],
    ["MARSELLA", 10, 4.636, -74.1281],
    ["CASTILLA", 7, 4.6408, -74.1425],
    ["LUSITANIA", 10, 4.6355, -74.1224],
    ["REMANSO SUR", 10, 4.6006, -74.1157],
    ["BOITA", 7, 4.6036, -74.1557],
    ["VILLA DEL RIO", 7, 4.6018, -74.1583],
    ["OLARTE", 7, 4.6012, -74.1644],
    ["ALQUERIA", 10, 4.5996, -74.133],
    ["TIMIZA", 7, 4.6161, -74.1512],
    {"nombre": "KENNEDY CENTRAL", "localidadIndex": 7, "lat": 4.6203, "lon": -74.1533},
    {"nombre": "CARVAJAL", "localidadIndex": 7, "lat": 4.6061, "lon": -74.1322}
  ] as any[]
].map(item => {
  if (Array.isArray(item)) {
    return {
      nombre: item[0],
      localidadIndex: item[1],
      lat: item[2],
      lon: item[3]
    };
  }
  return item;
});

export const LOCALIDADES_DB = [
  {
    "id_localidad": 1,
    "nombre": "Usaquén",
    "estrato_predominante": "3, 4, 5 y 6",
    "megaobras_infraestructura": ["Regiotram del Norte"],
    "equipamientos_salud_alta_complejidad": ["Fundación Santa Fe", "Clínica Reina Sofía", "Clínica Cobos"],
    "educacion_gran_formato": ["Universidad El Bosque"],
    "clubes_sociales_deportivos": ["Rotary Bogotá Usaquén", "Club Deportivo La Finca"],
    "corredores_gastronomicos": ["Casco histórico Usaquén"],
    "comercio_ancla": ["C.C. Hacienda Santa Bárbara", "C.C. Palatino"],
    "parques_metropolitanos": ["Red de parques vecinales (Toberín, Cedritos)"],
    "corredores_logisticos_estaciones": ["Autopista Norte", "Carrera Séptima"]
  },
  {
    "id_localidad": 11,
    "nombre": "Suba",
    "estrato_predominante": "Diversidad absoluta, predominio 3, 4, 5 y 6",
    "megaobras_infraestructura": ["Línea 2 del Metro de Bogotá"],
    "equipamientos_salud_alta_complejidad": ["Clínica Shaio", "Clínica de la Colina", "Clínica Colsanitas 103"],
    "educacion_gran_formato": ["UDCA Límite norte", "Colegios campestres noroccidente"],
    "clubes_sociales_deportivos": ["Club Los Lagartos", "Club Choquenzá", "Club Campestre Guaymaral"],
    "corredores_gastronomicos": ["Zona de Bulevar Niza", "Corredores emergentes Colina Campestre"],
    "comercio_ancla": ["C.C. Santafé", "C.C. Bulevar Niza"],
    "parques_metropolitanos": ["Humedal Córdoba", "Humedal Juan Amarillo", "Cerro La Conejera"],
    "corredores_logisticos_estaciones": ["Avenida Suba", "Av. Boyacá", "ALO norte"]
  },
  {
    "id_localidad": 2,
    "nombre": "Chapinero",
    "estrato_predominante": "4, 5 y 6",
    "megaobras_infraestructura": ["Línea 1 del Metro", "Línea 2 del Metro"],
    "equipamientos_salud_alta_complejidad": ["Clínica del Country", "Unidad de Servicios de Salud Chapinero"],
    "educacion_gran_formato": ["Clúster universitario Eje Ambiental", "Cll 72"],
    "clubes_sociales_deportivos": ["Centro Felicidad Chapinero"],
    "corredores_gastronomicos": ["Zona T", "Zona G", "Eje Calle 82 y Carrera 11"],
    "comercio_ancla": ["C.C. Andino", "El Retiro", "Atlantis Plaza"],
    "parques_metropolitanos": ["Parque El Virrey", "Parque del Chicó"],
    "corredores_logisticos_estaciones": ["Avenida Caracas", "Carrera 7", "Carrera 11"]
  },
  {
    "id_localidad": 10,
    "nombre": "Engativá",
    "estrato_predominante": "2 y 3",
    "megaobras_infraestructura": ["Línea 2 del Metro de Bogotá"],
    "equipamientos_salud_alta_complejidad": ["Hospital de Engativá", "Clínica Infantil Santa María del Lago"],
    "educacion_gran_formato": ["Universidad Minuto de Dios"],
    "clubes_sociales_deportivos": ["Complejo Compensar Avenida 68", "CEFE noroccidente"],
    "corredores_gastronomicos": ["Corredor comercial Normandía"],
    "comercio_ancla": ["C.C. Titán Plaza"],
    "parques_metropolitanos": ["Parque Normandía", "Humedal Juan Amarillo"],
    "corredores_logisticos_estaciones": ["Calle 80", "Avenida Boyacá"]
  },
  {
    "id_localidad": 9,
    "nombre": "Fontibón",
    "estrato_predominante": "2, 3 y 4",
    "megaobras_infraestructura": ["Regiotram de Occidente"],
    "equipamientos_salud_alta_complejidad": ["Hospital de Fontibón"],
    "educacion_gran_formato": ["Colegio La Felicidad IED"],
    "clubes_sociales_deportivos": ["Complejos deportivos zonales San Pablo, Salitre"],
    "corredores_gastronomicos": ["Zonas comerciales de Modelia", "Ciudad Salitre Occidental"],
    "comercio_ancla": ["Multiplaza", "C.C. El Edén"],
    "parques_metropolitanos": ["Eje ambiental Río Fucha", "Parque Sauzalito"],
    "corredores_logisticos_estaciones": ["Corredor de la Calle 13", "Concesión ALO Sur"]
  },
  {
    "id_localidad": 8,
    "nombre": "Kennedy",
    "estrato_predominante": "2 y 3",
    "megaobras_infraestructura": ["Línea 1 del Metro de Bogotá"],
    "equipamientos_salud_alta_complejidad": ["Hospital de Kennedy", "Clínica de Occidente"],
    "educacion_gran_formato": ["Jardines y colegios distritales centralidad Américas"],
    "clubes_sociales_deportivos": ["Atracciones mecánicas Centralidad Américas"],
    "corredores_gastronomicos": ["Av. Primera de Mayo", "sector Américas"],
    "comercio_ancla": ["Plaza de las Américas", "Corabastos"],
    "parques_metropolitanos": ["Parque Cayetano Cañizares", "Zonas verdes UPZ 44"],
    "corredores_logisticos_estaciones": ["Avenida Ciudad de Cali", "Avenida de las Américas"]
  },
  {
    "id_localidad": 7,
    "nombre": "Bosa",
    "estrato_predominante": "1 y 2",
    "megaobras_infraestructura": ["Línea 1 del Metro de Bogotá"],
    "equipamientos_salud_alta_complejidad": ["Nuevo Hospital de Bosa Calle 73 Sur"],
    "educacion_gran_formato": ["Universidad Distrital Sede Bosa"],
    "clubes_sociales_deportivos": ["Canchas y polideportivos barriales"],
    "corredores_gastronomicos": ["Comercios barriales Bosa Central", "El Recreo"],
    "comercio_ancla": ["C.C. Metro Recreo", "C.C. Gran Plaza Bosa"],
    "parques_metropolitanos": ["Espacios recreativos Tintal Sur", "zonas anexas al río Bogotá"],
    "corredores_logisticos_estaciones": ["Autopista Sur"]
  }
];

export function getLocalidadData(nombre: string | undefined | null) {
  if (!nombre) return null;
  const norm = nombre.toLowerCase().trim();
  return LOCALIDADES_DB.find(l => l.nombre.toLowerCase() === norm) || null;
}
