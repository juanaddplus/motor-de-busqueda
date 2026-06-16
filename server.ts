import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/analyze-property", async (req, res) => {
  try {
    const { address, coords, query } = req.body;
    
    // Validate request
    if (!address && !coords && !query) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const startTime = Date.now();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Configuración estándar JSON
    const jsonConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keys: { type: Type.STRING },
          nombre: { type: Type.STRING },
          upz: { type: Type.STRING },
          localidad: { type: Type.STRING },
          precio_m2: { type: Type.NUMBER },
          trafico: { type: Type.NUMBER },
          walkscore: { type: Type.NUMBER },
          perfil: { type: Type.STRING },
          infra: { type: Type.STRING },
          salud: { type: Type.STRING },
          comercio: { type: Type.STRING },
        },
        required: ["keys", "nombre", "upz", "localidad", "precio_m2", "trafico", "walkscore", "perfil", "infra", "salud", "comercio"]
      }
    };

    // --- REVISIÓN 1: Análisis Preliminar ---
    const prompt1 = `Actúa como un experto asesor inmobiliario enfocado en MARKETING Y VENTAJAS de las zonas.
El usuario ha ingresado la siguiente ubicación:
- Búsqueda del usuario: "${query || ''}"
- Dirección cartográfica: "${address?.display_name || ''}"
- Coordenadas: ${coords ? coords.lat + ", " + coords.lon : "Desconocido"}

EVALUACIÓN DE DIRECCIÓN BOGOTÁ:
Recibiste la dirección: "${query}".
REGLAS ESTRICTAS DE UBICACIÓN (Nomenclatura vs Localidad):
- Eje Calle 70 a 90, Carrera 100 a 120 -> ENGATIVÁ (Ej: Villas de Granada, Ciudadela Colsubsidio, Cortijo, Quirigua).
- Eje Calle 13 a 26, Carreras 70 a 100 -> FONTIBÓN (Ej: Modelia, Hayuelos).
- Eje Calle 130 a 170, Carreras 80 a 140 -> SUBA (Ej: Imperial, Lombardia).
- Eje Calle 96 Carrera 112 -> ENGATIVÁ (Villas de Granada). ¡NO ES SUBA, NO ES CHAPINERO, NO ES CARRERA 61!
- Eje Calle 23 Carrera 86 -> FONTIBÓN (Modelia Occidental). ¡NO ES SUBA!

¡ES TU DEBER VERIFICAR LA COHERENCIA! Si Nominatim (coordenadas o cartografía) te dice que "Calle 96 con Carrera 112" está en Chapinero o Suba, IGNÓRALO POR COMPLETO, porque eso es un error de Mapeo. Quédate con ENGATIVÁ (Villas de Granada). No inventes ni alteres la dirección dada.

TU OBJETIVO Y DIRECTRIZ ESTRICTA:
Eres un modelo analítico inmobiliario. Destaca lo MEJOR del entorno real de la nomenclatura dada.

1. Identifica el nombre REAL del barrio o micro-zona (ej. La Alameda, Chicó, El Chicó), UPZ y localidad. Si la dirección sugiere "La Alameda" cerca de la 175, nómbralo correctamente.
2. Determina un precio promedio por mt2 optimista y ajustado a la realidad del sector (SOLO EL NÚMERO DECIMAL EN MILLONES, ej: 6.5, 7.2, 5.0. Absolutamente PROHIBIDO poner "6500000" o números grandes).
3. "walkscore" (0-100) y tráfico (en km/h de velocidad promedio).
4. Redacta el "perfil" enfatizando el estilo de vida, seguridad y el perfil del comprador ideal que desea vivir ahí.
5. Destaca "infra": Mega-obras o conectividad excelente (vías principales, transporte cercano).
6. Destaca "salud" y "comercio": Menciona los mejores anclas (malls importantes, clubes, centros médicos prestigiosos o supermercados cercanos).

Devuelve ESTRICTAMENTE un JSON validado, SIN formato markdown (ni \`\`\`json), siguiendo la estructura solicitada.`;

    const response1 = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt1,
      config: jsonConfig
    });

    if (!response1.text) throw new Error("Empty response from AI step 1");

    // --- REVISIÓN 2: Auditoría Cartográfica ---
    const prompt2 = `Eres un auditor inmobiliario de alta precisión en Bogotá.
Esta es la SEGUNDA revisión obligatoria de 3.
El modelo base ha generado un BORRADOR de análisis para la dirección "${query}".
Dirección cartográfica base: "${address?.display_name || ''}"
Coordenadas: ${coords ? coords.lat + ", " + coords.lon : "Desconocido"}

Borrador generado:
${response1.text}

REGLAS ESTRICTAS DE AUDITORÍA:
- Eje Calle 70 a 90, Carrera 100 a 120 -> ENGATIVÁ (Ej: Villas de Granada, Ciudadela Colsubsidio).
- Eje Calle 13 a 26, Carreras 70 a 100 -> FONTIBÓN (Ej: Modelia, Hayuelos).
- Eje Calle 130 a 170, Carreras 80 a 140 -> SUBA (Ej: Imperial, Lombardia).
- Eje Calle 96 Carrera 112 -> ENGATIVÁ (Villas de Granada). ¡NO ES SUBA, NO ES CHAPINERO, NO ES CARRERA 61!
- Eje Calle 23 Carrera 86 -> FONTIBÓN (Modelia Occidental). ¡NO ES SUBA!
- Cl. 158a #12-24 y alrededores -> USAQUÉN (Ej: Cedritos, Barrancas). ¡NO ES SUBA!

CORRIGE cualquier error de UPZ, barrio o Localidad del borrador si contraviene las reglas o el sentido común cartográfico. 
Si el borrador es correcto, solo mejora la redacción haciéndola más precisa y atractiva para inversores.
Devuelve ESTRICTAMENTE el JSON validado (sin markdown).`;

    const response2 = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt2,
      config: jsonConfig
    });

    if (!response2.text) throw new Error("Empty response from AI step 2");

    // --- REVISIÓN 3: Refinamiento Final AVM ---
    const prompt3 = `Eres el Valuador Jefe de una firma PropTech de Real Estate. 
Esta es la TERCERA Y ÚLTIMA REVISIÓN del análisis para la dirección "${query}".

Borrador auditado en la iteración 2:
${response2.text}

TU TAREA FINAL:
1. Haz una corroboración final y definitiva de coherencia (barrio, UPZ, localidad). Nunca ubiques un barrio en la localidad equivocada.
2. Asegúrate de que el "perfil", "infra", "salud" y "comercio" sean extremadamente precisos, profesionales y destaquen lo mejor de la zona. 
3. Asegura que el precio_m2 sea un número realista con un máximo de 2 decimales (ej 4.5, 6.2).
4. El análisis debe estar blindado contra generalizaciones vacías.

Genera ESTRICTAMENTE el JSON final validado sin formato markdown.`;

    const response3 = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt3,
      config: jsonConfig
    });

    if (!response3.text) {
      throw new Error("Empty response from AI step 3");
    }

    // Asegurar un tiempo MÍNIMO de 15 segundos para transmitir "trabajo profundo" (3 revisiones)
    const duration = Date.now() - startTime;
    if (duration < 15000) {
      await new Promise(resolve => setTimeout(resolve, 15000 - duration));
    }

    const jsonData = JSON.parse(response3.text);
    return res.json(jsonData);

  } catch (error) {
    console.error("Error analyzing property:", error);
    res.status(500).json({ error: "Failed to analyze property profile." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server started correctly");
  });
}

startServer();
