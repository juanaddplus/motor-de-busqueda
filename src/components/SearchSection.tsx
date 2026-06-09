import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, AlertCircle, HelpCircle, Shield, Sparkles, Building2, MousePointerClick, CornerDownRight } from "lucide-react";
import { LOCS } from "../data";

interface SearchSectionProps {
  onSearchSubmit: (address: string, barrio?: string, localidad?: string) => void;
  onLocalitySelect: (locality: string) => void;
  loading: boolean;
}

interface SuggestionItem {
  type: "barrio" | "parsed" | "zone";
  title: string;
  subtitle: string;
  address: string;
  barrio: string;
  localidad: string;
  upz: string;
}

const POPULAR_SUGGESTIONS: Omit<SuggestionItem, "type">[] = [
  // Usaquén
  { title: "Cedritos", subtitle: "Usaquén (UPZ 07) — Eje comercial Calle 140", address: "Avenida Calle 140 # 9-50", barrio: "Cedritos", localidad: "Usaquén", upz: "UPZ 07" },
  { title: "Santa Bárbara", subtitle: "Usaquén (UPZ 11) — Sólida liquidez • Eje Unicentro", address: "Avenida Calle 116 # 15-28", barrio: "Santa Bárbara", localidad: "Usaquén", upz: "UPZ 11" },
  { title: "Usaquén / Santa Ana Oriental", subtitle: "Usaquén (UPZ 14) — Mansiones e historial patrimonio", address: "Avenida Calle 100 # 8A-30", barrio: "Usaquén / Santa Ana", localidad: "Usaquén", upz: "UPZ 14" },
  { title: "Toberín", subtitle: "Usaquén (UPZ 10) — Comercial y oficinas tradicionales", address: "Calle 161 # 21-40", barrio: "Santa Bárbara", localidad: "Usaquén", upz: "UPZ 10" },
  { title: "La Calleja", subtitle: "Usaquén (UPZ 12) — Entornos residenciales estrato 5/6", address: "Carrera 19 # 127C-50", barrio: "Santa Bárbara", localidad: "Usaquén", upz: "UPZ 12" },
  
  // Suba
  { title: "Colina Campestre", subtitle: "Suba (UPZ 105) — Proximidad Parque La Colina", address: "Avenida Boyacá # 138-20", barrio: "Colina Campestre / San José de Bavaria", localidad: "Suba", upz: "UPZ 105" },
  { title: "San José de Bavaria", subtitle: "Suba (UPZ 105) — Exclusivas casas suburbanas", address: "Calle 170 # 65-10", barrio: "Colina Campestre / San José de Bavaria", localidad: "Suba", upz: "UPZ 105" },
  { title: "Pasadena", subtitle: "Suba (UPZ 24 / Alhambra) — Conexión norte de alta liquidez", address: "Calle 106 # 49-30", barrio: "Colina Campestre / San José de Bavaria", localidad: "Suba", upz: "UPZ 24" },
  { title: "Niza Norte", subtitle: "Suba (UPZ 25) — Tradición y asombrosa trama verde", address: "Carrera 70D # 127-10", barrio: "Colina Campestre / San José de Bavaria", localidad: "Suba", upz: "UPZ 25" },
  { title: "Batán", subtitle: "Suba (UPZ 24) — Eje residencial contiguo al paramento de la Autopista Norte", address: "Calle 122 # 48-15", barrio: "Colina Campestre / San José de Bavaria", localidad: "Suba", upz: "UPZ 24" },
  { title: "Mazurén", subtitle: "Suba / Usaquén (Excelente conexión urbana)", address: "Calle 152 # 46-10", barrio: "Cedritos", localidad: "Suba", upz: "UPZ 07" },
  { title: "Suba Imperial", subtitle: "Suba (UPZ 71) — Cerca a CC Plaza Imperial y Metro L2", address: "Avenida Ciudad de Cali # 104-55", barrio: "Suba Imperial / Compartir", localidad: "Suba", upz: "UPZ 71" },
  { title: "Compartir", subtitle: "Suba (UPZ 71) — Área residencial de volumen y crédito", address: "Avenida Calle 145 # 115-10", barrio: "Suba Imperial / Compartir", localidad: "Suba", upz: "UPZ 71" },

  // Chapinero
  { title: "Chicó Rosales", subtitle: "Chapinero (UPZ 88/97) — Vértice premium corporativo y embajadas", address: "Carrera 7 # 82-44", barrio: "Chicó / Rosales", localidad: "Chapinero", upz: "UPZ 88/97" },
  { title: "El Refugio", subtitle: "Chapinero (UPZ 97) — Apartamentos de alto target y bellas vistas", address: "Calle 84 # 5-20", barrio: "Chicó / Rosales", localidad: "Chapinero", upz: "UPZ 88/97" },
  { title: "Chapinero Central", subtitle: "Chapinero (UPZ 90) — Nómadas digitales, renta corta y estudiantes", address: "Calle 63 # 13-20", barrio: "Chapinero Central", localidad: "Chapinero", upz: "UPZ 90" },
  { title: "Zona G (Gastronómica)", subtitle: "Chapinero (UPZ 90) — Residencial premium con alta oferta culinaria", address: "Carrera 5 # 70A-20", barrio: "Chapinero Central", localidad: "Chapinero", upz: "UPZ 90" },

  // Salitre
  { title: "Salitre Occidental", subtitle: "Fontibón (UPZ 110) — Corredor de negocios Av. El Dorado", address: "Avenida Calle 26 # 69-70", barrio: "Salitre Occidental", localidad: "Fontibón", upz: "UPZ 110" },
  { title: "Parque Salitre", subtitle: "Teusaquillo (UPZ 103) — Cerca de Gran Estación y amplios parques", address: "Calle 24 # 60-10", barrio: "Parque Salitre", localidad: "Teusaquillo", upz: "UPZ 103" }
];

export default function SearchSection({ onSearchSubmit, onLocalitySelect, loading }: SearchSectionProps) {
  const [address, setAddress] = useState("");
  const [barrio, setBarrio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [errorText, setErrorText] = useState("");
  
  const [showPicker, setShowPicker] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState("");
  
  // Handlers for interactive autocomplete dropdown
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Address pattern checker to extract Calle / Carrera
  const parseAddressDraft = (val: string) => {
    const rawNormalized = val.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    // Standard regex matches
    const clMatch = rawNormalized.match(/(?:calle|cll|cl|cl\s*e|cale)\s*(\d+)/i);
    const crMatch = rawNormalized.match(/(?:carrera|cra|cr|kr|krra|carera)\s*(\d+)/i);
    
    let parsedCalle: number | null = null;
    let parsedCarrera: number | null = null;

    if (clMatch) parsedCalle = parseInt(clMatch[1], 10);
    if (crMatch) parsedCarrera = parseInt(crMatch[1], 10);

    // If both are still null, look for sharp patterns like "140 # 9"
    if (!parsedCalle && !parsedCarrera) {
      const rawMatch = rawNormalized.match(/(\d+)\s*(?:#|no|num|numero)\s*(\d+)/i);
      if (rawMatch) {
        parsedCalle = parseInt(rawMatch[1], 10);
        parsedCarrera = parseInt(rawMatch[2], 10);
      }
    }

    // Capture special streets which acts as aliases
    if (rawNormalized.includes("autopista norte") || rawNormalized.includes("auto norte")) {
      parsedCarrera = 45;
      const autoMatch = rawNormalized.match(/(?:norte|auto)\s*(?:#|con|no|cl|calle)?\s*(\d+)/i);
      if (autoMatch) parsedCalle = parseInt(autoMatch[1], 10);
    }
    if (rawNormalized.includes("boyaca") || rawNormalized.includes("av boyaca")) {
      parsedCarrera = 72;
      const boyacaMatch = rawNormalized.match(/(?:boyaca)\s*(?:#|con|no|cl|calle)?\s*(\d+)/i);
      if (boyacaMatch) parsedCalle = parseInt(boyacaMatch[1], 10);
    }
    if (rawNormalized.includes("cali") || rawNormalized.includes("av cali")) {
      parsedCarrera = 86;
      const caliMatch = rawNormalized.match(/(?:cali)\s*(?:#|con|no|cl|calle)?\s*(\d+)/i);
      if (caliMatch) parsedCalle = parseInt(caliMatch[1], 10);
    }
    if (rawNormalized.includes("caracas") || rawNormalized.includes("av caracas")) {
      parsedCarrera = 14;
      const caracasMatch = rawNormalized.match(/(?:caracas)\s*(?:#|con|no|cl|calle)?\s*(\d+)/i);
      if (caracasMatch) parsedCalle = parseInt(caracasMatch[1], 10);
    }

    return { calle: parsedCalle, carrera: parsedCarrera };
  };

  // Rule-based localization and UPZ mapping
  const resolveAddressRules = (calle: number, carrera: number) => {
    // 1. Usaquén & Suba boundary (Calles 100 to 245)
    if (calle >= 100 && calle <= 245) {
      if (carrera <= 45) {
        // Usaquén
        if (calle >= 134) {
          return {
            localidad: "Usaquén",
            zonaName: "Cedritos",
            upz: "UPZ 07",
            description: "Cedritos (Calles 134 a 153, Oriente de la Autonorte)"
          };
        } else if (calle >= 116) {
          return {
            localidad: "Usaquén",
            zonaName: "Santa Bárbara",
            upz: "UPZ 11",
            description: "Santa Bárbara (Calles 116 a 134, Oriente de la Autonorte)"
          };
        } else {
          return {
            localidad: "Usaquén",
            zonaName: "Usaquén / Santa Ana",
            upz: "UPZ 14",
            description: "Usaquén Central y Santa Ana (Calles 100 a 116, Oriente de Autonorte)"
          };
        }
      } else {
        // Suba
        if (carrera >= 80) {
          return {
            localidad: "Suba",
            zonaName: "Suba Imperial / Compartir",
            upz: "UPZ 71",
            description: "Suba Imperial / Compartir (Área residencial de volumen)"
          };
        } else {
          return {
            localidad: "Suba",
            zonaName: "Colina Campestre / San José de Bavaria",
            upz: "UPZ 105",
            description: "Colina Campestre / San José de Bavaria (Poniente de Autonorte)"
          };
        }
      }
    }

    // 2. Chapinero (Chicó, Rosales, Cabrera: Calles 72 to 100, East of Caracas/AutoNorte)
    if (calle >= 72 && calle < 100) {
      if (carrera <= 20) {
        return {
          localidad: "Chapinero",
          zonaName: "Chicó / Rosales",
          upz: "UPZ 88/97",
          description: "Chicó / Rosales (Borde Oriental de Chapinero premium)"
        };
      }
    }

    // 3. Chapinero Central (Calles 39 to 72, East of Caracas)
    if (calle >= 39 && calle < 72) {
      if (carrera <= 20) {
        return {
          localidad: "Chapinero",
          zonaName: "Chapinero Central",
          upz: "UPZ 90",
          description: "Chapinero Central (Nómadas digitales y rentas de alta rotación)"
        };
      }
    }

    // 4. Ciudad Salitre (Calles 22 to 30)
    if (calle >= 22 && calle <= 30) {
      if (carrera >= 50 && carrera <= 68) {
        return {
          localidad: "Teusaquillo",
          zonaName: "Parque Salitre",
          upz: "UPZ 103",
          description: "Parque Salitre (Teusaquillo - Alta planificación urbana)"
        };
      } else if (carrera > 68 && carrera <= 86) {
        return {
          localidad: "Fontibón",
          zonaName: "Salitre Occidental",
          upz: "UPZ 110",
          description: "Salitre Occidental (Fontibón - Estabilidad corporativa y residencial)"
        };
      }
    }

    return null;
  };

  // Dynamically update suggestions list when the address input values change
  useEffect(() => {
    if (!address.trim()) {
      // If empty input, suggest popular neighborhoods
      const list = POPULAR_SUGGESTIONS.map(p => ({ ...p, type: "barrio" as const }));
      setSuggestions(list);
      return;
    }

    const normQuery = address.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // 1. Filter standard static suggestions list by text match
    let filtered: SuggestionItem[] = POPULAR_SUGGESTIONS.filter(item => {
      return (
        item.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery) ||
        item.subtitle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery) ||
        item.barrio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery) ||
        item.address.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQuery)
      );
    }).map(p => ({ ...p, type: "barrio" as const }));

    // 2. Parse the input string for geometry rules in real-time!
    const parsed = parseAddressDraft(address);
    if (parsed.calle && parsed.carrera) {
      const ruleResult = resolveAddressRules(parsed.calle, parsed.carrera);
      if (ruleResult) {
        // Inject a dynamic parsed result suggestion at the top of the dropdown!
        filtered.unshift({
          type: "parsed",
          title: `Dirección Detectada Geométricamente`,
          subtitle: `Calle ${parsed.calle} # Carrera ${parsed.carrera} ➔ Ubicada en ${ruleResult.zonaName} (${ruleResult.localidad} - ${ruleResult.upz})`,
          address: address.trim(),
          barrio: ruleResult.zonaName,
          localidad: ruleResult.localidad,
          upz: ruleResult.upz
        });
      }
    }

    setSuggestions(filtered);
  }, [address]);

  // Click outside listener for the dropdown container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectSuggestion = (item: SuggestionItem) => {
    setAddress(item.address);
    setBarrio(item.barrio);
    setLocalidad(item.localidad);
    setErrorText("");
    setIsFocused(false);
    
    // Direct submit with correct mapped attributes
    onSearchSubmit(item.address, item.barrio, item.localidad);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setErrorText("Por favor ingresa una dirección para geolocalizar.");
      return;
    }

    // Try to auto-resolve locality if empty
    let finalLocalidad = localidad;
    let finalBarrio = barrio;

    if (!finalLocalidad) {
      const parsed = parseAddressDraft(address);
      if (parsed.calle && parsed.carrera) {
        const ruleRes = resolveAddressRules(parsed.calle, parsed.carrera);
        if (ruleRes) {
          finalLocalidad = ruleRes.localidad;
          finalBarrio = ruleRes.zonaName;
        }
      }
    }

    // Fallbacks from keywords inside address
    if (!finalLocalidad) {
      const lower = address.toLowerCase();
      if (lower.includes("cedritos") || lower.includes("santa barbara") || lower.includes("usaquen") || lower.includes("cantalejo") || lower.includes("toberin")) {
        finalLocalidad = "Usaquén";
      } else if (lower.includes("suba") || lower.includes("colina") || lower.includes("niza") || lower.includes("bavaria") || lower.includes("batan")) {
        finalLocalidad = "Suba";
      } else if (lower.includes("chico") || lower.includes("rosales") || lower.includes("chapinero")) {
        finalLocalidad = "Chapinero";
      }
    }

    setErrorText("");
    onSearchSubmit(address.trim(), finalBarrio ? finalBarrio.trim() : undefined, finalLocalidad ? finalLocalidad.trim() : undefined);
  };

  const handlePickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocality) {
      setErrorText("Por favor selecciona una localidad del listado.");
      return;
    }
    setErrorText("");
    onLocalitySelect(selectedLocality);
  };

  const sortedLocs = [...LOCS].sort();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-xl shadow-neutral-100 max-w-2xl mx-auto mt-6">
      {!showPicker ? (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight text-center mb-1">
            Motor de Análisis Inmobiliario PropTech
          </h2>
          <p className="text-xs text-neutral-500 text-center mb-6">
            Escribe tu dirección o barrio. El sistema calcula autómaticamente tu UPZ y Localidad sin errores catastrales.
          </p>

          <form onSubmit={handleSearch} className="space-y-4 relative">
            <div className="space-y-4" ref={dropdownRef}>
              {/* Main Buscador input with floating suggestions */}
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-extrabold mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                  Ingresa tu Dirección o Barrio Colombiano
                </label>
                
                <div className="flex bg-neutral-50 rounded-2xl p-2 border border-neutral-200 focus-within:border-brand-accent transition-all focus-within:shadow-md focus-within:shadow-brand-accent/5 focus-within:bg-white">
                  <div className="flex items-center flex-1 px-3 py-1">
                    <Search className="text-neutral-400 shrink-0 mr-3 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Ej: Calle 140 # 9-50 o Pasadena"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrorText("");
                      }}
                      onFocus={() => setIsFocused(true)}
                      className="w-full bg-transparent text-sm md:text-base text-brand-dark focus:outline-none placeholder-neutral-400 font-semibold"
                      disabled={loading}
                      id="unified-search-input"
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-dark text-white rounded-xl px-5 py-3 text-xs md:text-sm font-bold shadow-md hover:bg-neutral-800 transition active:scale-95 flex items-center justify-center shrink-0"
                    disabled={loading}
                    id="unified-search-btn"
                  >
                    Valuación AVM
                  </button>
                </div>

                {/* Intelligent suggestions dropdown popup overlay */}
                {isFocused && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-neutral-200/90 shadow-2xl z-50 overflow-hidden max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Header banner */}
                    <div className="bg-neutral-50/80 px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold">
                        {address.trim() ? "📍 Coincidencias y Filtro Inteligente" : "🔑 Sugerencias directas para demostración:"}
                      </span>
                      <span className="text-[9px] text-brand-accent font-bold flex items-center gap-1.5">
                        <MousePointerClick className="w-3 h-3" /> Haz click para autocompletar
                      </span>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {suggestions.map((item, index) => {
                        const isParsed = item.type === "parsed";
                        return (
                          <div
                            key={index}
                            onClick={() => selectSuggestion(item)}
                            className={`p-3.5 hover:bg-neutral-50 cursor-pointer transition flex items-start gap-3 text-left ${
                              isParsed ? "bg-brand-accent/5 hover:bg-brand-accent/10 border-l-4 border-l-brand-accent" : ""
                            }`}
                          >
                            {isParsed ? (
                              <Sparkles className="w-4 h-4 text-brand-accent shrink-0 mt-0.5 animate-pulse" />
                            ) : (
                              <Building2 className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold leading-tight ${isParsed ? "text-brand-accent text-[13px]" : "text-brand-dark"}`}>
                                  {item.title}
                                </span>
                                {!isParsed && (
                                  <span className="text-[9px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-extrabold select-none">
                                    {item.localidad}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                                {item.subtitle}
                              </p>
                              {isParsed && (
                                <div className="text-[10px] text-brand-accent/90 font-bold flex items-center gap-1 mt-1">
                                  <CornerDownRight className="w-3.5 h-3.5" />
                                  <span>Autoresolver y evaluar de inmediato de forma inalterable</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errorText && (
              <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold px-4 pt-1 justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorText}</span>
              </div>
            )}
          </form>

          {/* Prompt status feedback bar */}
          <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
            <Shield className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-600 leading-relaxed font-semibold">
              <span className="text-brand-dark font-extrabold">Geolocalización Libre de Errores: </span>
              El buscador interpreta la nomenclatura original de Bogotá. Si ingresas <span className="text-brand-accent">Pasadena</span> se tasará en <span className="text-brand-dark">Suba (UPZ 24)</span>, y si ingresas <span className="text-brand-accent">Cedritos</span> se tasará en <span className="text-brand-dark">Usaquén (UPZ 07)</span>, evitando las cruces de fronteras de la Autopista Norte.
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              onClick={() => {
                setShowPicker(true);
                setErrorText("");
              }}
              className="text-xs text-brand-accent font-bold hover:underline"
            >
              ¿La dirección no registra? Buscar por localidad directamente →
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight text-center mb-2">
            Selección Directa de Localidad
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 text-center mb-6">
            Construye el reporte del mercado PropTech local seleccionando la localidad administrativa directamente.
          </p>

          <form onSubmit={handlePickerSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm text-brand-dark focus:outline-none focus:border-brand-accent font-medium cursor-pointer"
                id="add-locality-select"
              >
                <option value="">Selecciona la localidad urbana...</option>
                {sortedLocs.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-brand-dark text-white rounded-xl px-6 py-3 text-xs md:text-sm font-bold shadow-md hover:bg-neutral-800 transition active:scale-95 cursor-pointer shrink-0"
                id="add-picker-btn"
              >
                Analizar Localidad
              </button>
            </div>

            {errorText && (
              <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold px-4 justify-center">
                <AlertCircle className="w-4.5 h-4.5" />
                <span>{errorText}</span>
              </div>
            )}

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowPicker(false);
                  setErrorText("");
                }}
                className="text-xs text-brand-accent font-bold hover:underline"
              >
                ← Volver al buscador por dirección
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
