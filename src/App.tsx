/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle,
  Database,
  BarChart3,
  Phone,
  Mail,
  User,
  Trash2,
  ExternalLink,
  ChevronRight,
  Eye,
  Server,
  Heart,
  ShoppingBag,
  UserCheck
} from "lucide-react";
import { Zone, Lead, AnalysisState } from "./types";
import { findZone, vectorFor, fmtMoney, geocode, nearestBarrio, getLocalidadFromNomenclature } from "./utils";
import { ZONAS, getInfraForLocalidad, getLocalidadData } from "./data";
import SearchSection from "./components/SearchSection";
import ScanningProgress from "./components/ScanningProgress";

export default function App() {
  const [address, setAddress] = useState<string>("");
  const [searchState, setSearchState] = useState<AnalysisState>({
    searching: false,
    searchedAddress: null,
    selectedZone: null,
    statusText: "",
    unlocked: false,
  });

  // Property type selected for custom analysis
  const [propertyType, setPropertyType] = useState<string>("Apartamento");

  // Lead capture form state
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  // Admin and Panel toggle
  const [adminMode, setAdminMode] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Parse URL search params for direct lookup (e.g. ?dir=Calle+93)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialDir = params.get("dir") || params.get("direccion");
    if (initialDir) {
      handleAddressSearch(initialDir);
    }
  }, []);

  // Fetch leads when admin mode is turned on
  useEffect(() => {
    if (adminMode) {
      fetchLeads();
    }
  }, [adminMode]);

  // Handle active geocoding and nearest neighborhood matching of coordinates to zones
  useEffect(() => {
    if (!searchState.searching || !searchState.searchedAddress) return;

    let active = true;

    async function runGeocoding() {
      const query = searchState.searchedAddress!;
      const explicitBarrio = searchState.searchedBarrio;
      const explicitLocalidad = searchState.searchedLocalidad;

      // 1. If explicit locality is supplied, we perform exact deterministic match (zero error)
      if (explicitLocalidad) {
        let matchedZone: Zone | null = null;
        
        if (explicitBarrio) {
          const bNorm = explicitBarrio.toLowerCase().trim();
          const lNorm = explicitLocalidad.toLowerCase().trim();
          
          // Try to find a zone of this localidad that matches the barrio name or registered keys
          matchedZone = ZONAS.find(z => 
            z.localidad.toLowerCase() === lNorm &&
            (z.nombre.toLowerCase().includes(bNorm) || 
             bNorm.includes(z.nombre.toLowerCase()) || 
             z.keys.toLowerCase().includes(bNorm))
          ) || null;
        }
        
        // If still not matched, find any zone in this locality
        if (!matchedZone) {
          matchedZone = ZONAS.find(z => z.localidad.toLowerCase() === explicitLocalidad.toLowerCase().trim()) || null;
        }

        if (matchedZone) {
          if (active) {
            setSearchState((prev) => ({
              ...prev,
              selectedZone: matchedZone
            }));
          }
          return;
        }
      }

      // Handle direct locality inputs
      if (query.startsWith("Localidad ")) {
        const locName = query.replace("Localidad ", "").trim();
        const matched = findZone(locName);
        if (active) {
          setSearchState((prev) => ({
            ...prev,
            selectedZone: matched
          }));
        }
        return;
      }

      try {
        const coords = await geocode(query);
        const nomenclatureLocalidad = getLocalidadFromNomenclature(query);

        if (coords && active) {
          const matchResult = nearestBarrio(coords.lat, coords.lon);
          if (matchResult) {
            let finalLocalidad = matchResult.localidad;
            if (nomenclatureLocalidad) {
              finalLocalidad = nomenclatureLocalidad;
            }

            // Find specific zone by barrio name first, then by its general localidad
            let matchedZone = findZone(matchResult.barrio);
            if (!matchedZone || (matchedZone.localidad.toLowerCase() !== finalLocalidad.toLowerCase())) {
              matchedZone = findZone(finalLocalidad);
            }

            if (active) {
              setSearchState((prev) => ({
                ...prev,
                selectedZone: matchedZone || findZone(query)
              }));
            }
            return;
          }
        }

        // String-based fallback match utilizing nomenclature info if available
        const fallbackZone = findZone(nomenclatureLocalidad || query);
        if (active) {
          setSearchState((prev) => ({
            ...prev,
            selectedZone: fallbackZone
          }));
        }
      } catch (err) {
        console.error("Geocoding failed inside active search effect", err);
        const fallbackZone = findZone(query);
        if (active) {
          setSearchState((prev) => ({
            ...prev,
            selectedZone: fallbackZone
          }));
        }
      }
    }

    runGeocoding();

    return () => {
      active = false;
    };
  }, [searchState.searching, searchState.searchedAddress, searchState.searchedBarrio, searchState.searchedLocalidad]);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const stored = localStorage.getItem("add_leads");
      if (stored) {
        setLeads(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error fetching leads", err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const updated = leads.filter((l) => l.id !== id);
      setLeads(updated);
      localStorage.setItem("add_leads", JSON.stringify(updated));
    } catch (err) {
      console.error("Error deleting lead", err);
    }
  };

  const handleAddressSearch = (addr: string, b?: string, loc?: string) => {
    setAddress(addr);
    setSearchState({
      searching: true,
      searchedAddress: addr,
      searchedBarrio: b || null,
      searchedLocalidad: loc || null,
      selectedZone: null,
      statusText: b && loc ? "Validando dirección con triple factor (3NF)..." : "Geocodificando dirección...",
      unlocked: false,
    });
  };

  const handleLocalitySelect = (localityName: string) => {
    setAddress(`Localidad ${localityName}`);
    setSearchState({
      searching: true,
      searchedAddress: `Localidad ${localityName}`,
      selectedZone: null,
      statusText: "Analizando polígono por localidad...",
      unlocked: false,
    });
  };

  const handleScanningComplete = () => {
    setSearchState((prev) => {
      const finalZone = prev.selectedZone || findZone(prev.searchedAddress || "");
      return {
        ...prev,
        searching: false,
        selectedZone: finalZone
      };
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono || !formData.correo) {
      alert("Por favor completa todos los campos del formulario.");
      return;
    }

    setFormLoading(true);

    const zoneName = searchState.selectedZone?.nombre || "Zona General Bogotá";
    const upzNum = searchState.selectedZone?.upz || "ND";

    const leadPayload = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      correo: formData.correo,
      tipo: propertyType,
      direccion_consultada: searchState.searchedAddress || address,
      zona_identificada: `${zoneName} (UPZ ${upzNum})`
    };

    try {
      // 1. Save to local storage for SPA deployment
      const stored = localStorage.getItem("add_leads");
      const currentLeads = stored ? JSON.parse(stored) : [];
      
      const newLead = {
         id: "LD-" + Date.now().toString().slice(-6),
         timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
         nombre: leadPayload.nombre,
         telefono: leadPayload.telefono,
         correo: leadPayload.correo,
         tipo: leadPayload.tipo,
         direccionConsultada: leadPayload.direccion_consultada,
         zonaIdentificada: leadPayload.zona_identificada,
      };
      
      currentLeads.push(newLead);
      localStorage.setItem("add_leads", JSON.stringify(currentLeads));

      setSuccessBanner(true);
      // Desbloquear reporte completo
      setSearchState((prev) => ({ ...prev, unlocked: true }));
    } catch (err) {
      console.error("Lead submission failed", err);
      // Fail gracefully: still unlock
      setSearchState((prev) => ({
        ...prev,
        unlocked: true
      }));
    } finally {
      setFormLoading(false);
    }
  };

  const handleReset = () => {
    setAddress("");
    setSearchState({
      searching: false,
      searchedAddress: null,
      selectedZone: null,
      statusText: "",
      unlocked: false,
    });
    setFormData({ nombre: "", telefono: "", correo: "" });
    setSuccessBanner(false);
  };

  const activeVector = searchState.selectedZone ? vectorFor(searchState.selectedZone) : null;

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans antialiased text-brand-dark flex flex-col selection:bg-brand-accent/30">
      
      {/* Premium Navigation Header */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-40 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <span className="font-display text-3xl font-extrabold tracking-tight text-brand-dark transition hover:opacity-95">
              add<span className="text-brand-accent">+</span>
            </span>
            <div className="hidden sm:block h-6 w-px bg-neutral-200 mx-2" />
            <span className="hidden sm:block text-[10px] uppercase tracking-widest font-bold text-neutral-400">
              Inteligencia <span className="text-brand-accent">Inmobiliaria</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition flex items-center gap-1.5 ${
                adminMode
                  ? "bg-brand-accent text-white border-brand-accent"
                  : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {adminMode ? "Ver App Real" : "Panel de Leads (Admin)"}
            </button>
            
            {searchState.searchedAddress && (
              <button
                onClick={handleReset}
                className="bg-brand-dark text-white rounded-full px-4 py-2 text-xs font-bold hover:bg-neutral-800 transition active:scale-95"
              >
                Nueva Consulta
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Admin Panel Overlay */}
      {adminMode ? (
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-accent flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  Base de Datos en Memoria (3NF)
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark mt-1">
                  Panel de Leads Inmobiliarios
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Visualice de forma segura las consultas de propietarios interesados en el Automated Valuation Model.
                </p>
              </div>
              <button
                onClick={fetchLeads}
                className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-brand-dark px-4 py-2 rounded-lg transition"
              >
                Actualizar Listado
              </button>
            </div>

            {leadsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-neutral-500">Cargando base de datos relacional de prospectos...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 px-6">
                <Layers className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-brand-dark">No se registran contactos aún</h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2">
                  Los prospectos recolectados por el formulario de la aplicación se guardarán en esta colección de persistencia temporal durante la sesión.
                </p>
                <button
                  onClick={() => setAdminMode(false)}
                  className="bg-brand-dark text-white rounded-full px-6 py-2.5 text-xs font-bold mt-6 shadow hover:bg-neutral-800 transition active:scale-95"
                >
                  Volver y Registrar un Lead de Prueba
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Propietario / Cliente</th>
                      <th className="py-3 px-4">Propiedad</th>
                      <th className="py-3 px-4">Ubicación Buscada</th>
                      <th className="py-3 px-4">Zona Identificada</th>
                      <th className="py-3 px-4">Fecha / Hora</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-neutral-400 text-xs">{l.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-brand-dark text-sm">{l.nombre}</div>
                          <div className="flex flex-col text-xs text-neutral-500 mt-0.5 space-y-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-brand-accent shrink-0" />
                              {l.telefono}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                              {l.correo}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block bg-brand-light text-brand-dark border border-neutral-200 rounded-full text-xs px-3 py-1 font-semibold">
                            {l.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-neutral-600 max-w-[150px] truncate" title={l.direccionConsultada}>
                          {l.direccionConsultada}
                        </td>
                        <td className="py-4 px-4 text-xs font-bold text-brand-dark">
                          {l.zonaIdentificada}
                        </td>
                        <td className="py-4 px-4 text-xs text-neutral-400">{l.timestamp}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => deleteLead(l.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition"
                            title="Eliminar Registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full flex flex-col justify-center py-6 px-4 md:py-12">
          
          {/* STATE 1: Default search block */}
          {!searchState.searchedAddress && !searchState.searching && (
            <div className="max-w-4xl mx-auto w-full">
              {/* Luxury Intro Hero Banner */}
              <div className="text-center mb-8 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1 bg-white border border-neutral-100 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-accent shadow-sm mb-4">
                  <Sparkles className="w-4.5 h-4.5 text-brand-accent fill-brand-accent/20" />
                  Estrategia AVM Validadora & PropTech
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-dark leading-[1.1] mb-4">
                  Evaluación Algorítmica de Suelo en Bogotá
                </h1>
                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                  Cruzamos datos de la CCB, IDU, DANE y obras activas en Tercera Forma Normal (3NF) para entregar la liquidez real de tu polígono residencial en segundos.
                </p>
              </div>

              <SearchSection
                onSearchSubmit={handleAddressSearch}
                onLocalitySelect={handleLocalitySelect}
                loading={searchState.searching}
              />
            </div>
          )}

          {/* STATE 2: Loader in progress */}
          {searchState.searching && (
            <div className="max-w-3xl mx-auto w-full">
              <ScanningProgress
                address={searchState.searchedAddress || ""}
                onComplete={handleScanningComplete}
              />
            </div>
          )}

          {/* STATE 3: Report & Dynamic Analysis page */}
          {!searchState.searching && searchState.searchedAddress && (
            <div className="max-w-4xl mx-auto w-full">
              
              {/* Success Banner if unlocked */}
              {successBanner && (
                <div className="bg-green-600 text-white font-bold text-center py-4 px-6 rounded-2xl shadow-lg mb-6 flex items-center justify-center gap-3 animate-bounce">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>✓ Análisis PropTech 3NF Desbloqueado Exitosamente · ¡Te contactaremos en menos de 24 horas hábiles!</span>
                </div>
              )}

              {/* Main Zone Hero */}
              <div className="bg-gradient-to-br from-brand-dark to-[#2a3e4c] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-6">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-accent bg-brand-accent/15 px-3 py-1 rounded-full border border-brand-accent/30">
                    {searchState.selectedZone ? "Polígono Parametrizado en 3NF" : "Análisis Macroeconómico"}
                  </span>

                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4" id="view-zone-title">
                    {searchState.selectedZone ? searchState.selectedZone.nombre : "Zona General / Bogotá Metropolitana"}
                  </h1>

                  <p className="text-xs md:text-sm text-neutral-300 font-semibold mt-2 flex items-center gap-1.5" id="view-zone-subtitle">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                    {searchState.selectedZone
                      ? `UPZ ${searchState.selectedZone.upz} · Localidad de ${searchState.selectedZone.localidad}`
                      : `Ubicación consultada: "${searchState.searchedAddress}"`}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-white/10 text-white border border-white/10 rounded-full text-[10px] uppercase font-bold py-1 px-3">
                      Automated Valuation Model (AVM)
                    </span>
                    <span className="bg-brand-accent/20 text-brand-accent border border-brand-accent/25 rounded-full text-[10px] uppercase font-bold py-1 px-3">
                      {searchState.unlocked ? "Resultados Desbloqueados" : "Pre-visualización Limitada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Form for Property customization */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="text-sm font-bold text-brand-dark">Personalizar mi análisis</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Elige el tipo de inmueble para recalcular los factores de fricción.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {["Apartamento", "Casa", "Apartaestudio", "Local / Oficina", "Otro"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPropertyType(type)}
                      disabled={searchState.unlocked && successBanner}
                      className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                        propertyType === type
                          ? "bg-brand-dark text-white shadow"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION: KPI Grid (Visible to all users) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-lg mb-6">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold block mb-2">
                  MÓDULO CATASTRAL DE VALORACIÓN
                </span>
                <h3 className="text-xl font-extrabold text-brand-dark tracking-tight mb-5">
                  La valoración algorítmica de tu polígono
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* KPI 1 */}
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/60 hover:shadow-md transition">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-extrabold">
                      Precio Promedio M² Ajustado
                    </span>
                    <div className="text-3xl font-extrabold text-brand-dark tracking-tight mt-2" id="kpi-val-m2-price">
                      {searchState.selectedZone
                        ? fmtMoney(searchState.selectedZone.precio_m2)
                        : "$10.1M"}
                      <span className="text-xs font-semibold text-neutral-500 ml-1">COP</span>
                    </div>
                    <div className="bg-brand-accent/10 text-brand-accent border border-brand-accent/20 rounded-lg text-[10px] font-bold px-2 py-0.5 inline-block mt-3">
                      Aplica Coeficiente de Fricción tradicional (-15%)
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/60 hover:shadow-md transition">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-extrabold">
                      Caminabilidad & Tráfico Peatonal
                    </span>
                    <div className="text-3xl font-extrabold text-brand-dark tracking-tight mt-2" id="kpi-val-walkscore">
                      {searchState.selectedZone ? `${searchState.selectedZone.walkscore}/100` : "85/100"}
                      <span className="text-xs font-semibold text-neutral-400 ml-1">WalkScore</span>
                    </div>
                    <div className="text-xs font-semibold text-neutral-500 mt-3" id="kpi-val-traffic-note">
                      {searchState.selectedZone
                        ? `Velocidad vehicular de congestión local: ${searchState.selectedZone.trafico} km/h`
                        : "Velocidad vehicular media: 21.6 km/h"}
                    </div>
                  </div>
                </div>
              </div>

              {/* PERSISTENT WRAPPER WITH LURKING BLUR STATE OR UNLOCKED */}
              <div className="relative">
                
                {/* LURKING locked layer overlay + LEAD FORM */}
                {!searchState.unlocked && (
                  <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/20 flex flex-col justify-start items-center pt-8 px-4 h-full pointer-events-auto">
                    <div className="bg-white rounded-3xl p-6 md:p-8 text-brand-dark shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-neutral-200/60 w-full max-w-3xl text-left relative z-30 animate-fade-in mt-10">
                        <div className="relative z-10">
                          <span className="text-[10px] uppercase tracking-widest font-extrabold bg-brand-light text-brand-accent px-3 py-1 rounded-full border border-brand-accent/20 inline-block mb-4">
                            Desbloqueo Parametrizado Gratis
                          </span>
                          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight mb-3">
                            Desbloquea el análisis PropTech relacional AVM para tu polígono
                          </h3>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-medium">
                            Completa tus datos para consultar gratuitamente la matriz y variables de Tercera Forma Normal (3NF) aplicadas a tu inmueble.
                          </p>

                          <form onSubmit={handleLeadSubmit} className="space-y-4 font-sans max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 focus-within:border-brand-accent transition flex items-center gap-2">
                                <User className="w-4 h-4 text-neutral-400 shrink-0" />
                                <input
                                  type="text"
                                  required
                                  placeholder="Tu Nombre"
                                  value={formData.nombre}
                                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                  className="w-full bg-transparent text-xs text-brand-dark focus:outline-none placeholder-neutral-400 font-semibold"
                                  disabled={formLoading}
                                />
                              </div>
                              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 focus-within:border-brand-accent transition flex items-center gap-2">
                                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                                <input
                                  type="tel"
                                  required
                                  placeholder="WhatsApp"
                                  value={formData.telefono}
                                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                  className="w-full bg-transparent text-xs text-brand-dark focus:outline-none placeholder-neutral-400 font-semibold"
                                  disabled={formLoading}
                                />
                              </div>
                              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 focus-within:border-brand-accent transition flex items-center gap-2">
                                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                                <input
                                  type="email"
                                  required
                                  placeholder="Correo"
                                  value={formData.correo}
                                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                  className="w-full bg-transparent text-xs text-brand-dark focus:outline-none placeholder-neutral-400 font-semibold"
                                  disabled={formLoading}
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={formLoading}
                              className="w-full bg-brand-dark hover:bg-neutral-800 text-white font-extrabold text-xs md:text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer mt-4 border border-white/10"
                              id="lead-submit-btn"
                            >
                              {formLoading ? (
                                <>
                                  <Loader2 className="w-4.5 h-4.5 animate-spin text-brand-accent shrink-0" />
                                  <span>Procesando Desbloqueo...</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-4 h-4 text-brand-accent shrink-0" />
                                  <span>Desbloquear Reporte AVM Instantáneo →</span>
                                </>
                              )}
                            </button>
                            <p className="text-[10px] text-neutral-500 text-center font-medium mt-3">
                              Compatibilidad 3NF garantizada · Entrega de reporte gratuita y contacto con analista humano opcional en menos de 24 hrs.
                            </p>
                          </form>
                        </div>
                    </div>
                  </div>
                )}

                {/* BLURRED / LOCKED PAGES CONTENT CONTAINER */}
                <div className="relative w-full">
                  <div className={`transition-all duration-700 ${!searchState.unlocked ? "filter blur-[6px] opacity-20 select-none pointer-events-none max-h-[600px] overflow-hidden" : "filter-none opacity-100 max-h-[5000px] overflow-visible"}`}>
                  
                    {/* 01 · DASHBOARD DE DATOS ESTRUCTURADOS */}
                  <div className="bg-brand-dark rounded-3xl p-6 md:p-8 shadow-xl mb-6 border-b-4 border-brand-accent overflow-hidden relative">
                    <div className="absolute right-3 top-3 opacity-10">
                      <Database className="w-32 h-32 text-white shrink-0" />
                    </div>
                    
                    <span className="text-[10px] uppercase tracking-widest text-brand-accent font-extrabold flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-4 h-4 text-brand-accent fill-brand-accent/25 animate-pulse" />
                      DASHBOARD MAESTRO · DATOS RELACIONALES
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                      Matriz de Variables para {searchState.selectedZone?.nombre || "tu zona"}
                    </h3>

                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative z-10">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead>
                            <tr className="bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider">
                              <th className="px-4 py-3">Variable (Entidad)</th>
                              <th className="px-4 py-3">Valor / Atributo</th>
                              <th className="px-4 py-3">Impacto en Renta</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-neutral-300 font-medium">
                            <tr className="hover:bg-white/5 transition">
                              <td className="px-4 py-3 font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-accent" /> Localidad</td>
                              <td className="px-4 py-3">{searchState.selectedZone?.localidad || "ND"}</td>
                              <td className="px-4 py-3 text-emerald-400 font-semibold">+ Alta Demanda Administrativa</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                              <td className="px-4 py-3 font-bold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-brand-accent" /> UPZ</td>
                              <td className="px-4 py-3">UPZ {searchState.selectedZone?.upz || "ND"}</td>
                              <td className="px-4 py-3 text-emerald-400 font-semibold">Densificación Aprobada</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                              <td className="px-4 py-3 font-bold text-white flex items-center gap-2"><Heart className="w-4 h-4 text-brand-accent" /> Hubs Clínicos</td>
                              <td className="px-4 py-3 max-w-[200px] whitespace-normal">
                                {getLocalidadData(searchState.selectedZone?.localidad)?.equipamientos_salud_alta_complejidad.join(", ") || searchState.selectedZone?.salud || "Clínicas Locales"}
                              </td>
                              <td className="px-4 py-3 text-emerald-400 font-semibold">+ Atracción de Médicos</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                              <td className="px-4 py-3 font-bold text-white flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-brand-accent" /> Comercio Ancla</td>
                              <td className="px-4 py-3 max-w-[200px] whitespace-normal">
                                {getLocalidadData(searchState.selectedZone?.localidad)?.comercio_ancla.join(", ") || searchState.selectedZone?.comercio || "Comercio Mixto"}
                              </td>
                              <td className="px-4 py-3 text-emerald-400 font-semibold">+ Alta Caminabilidad</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition">
                              <td className="px-4 py-3 font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-accent" /> Estrato Predominante</td>
                              <td className="px-4 py-3">
                                {getLocalidadData(searchState.selectedZone?.localidad)?.estrato_predominante || (searchState.selectedZone?.localidad === 'Usaquén' || searchState.selectedZone?.localidad === 'Chapinero' ? '4 a 6' : '3 a 4')}
                              </td>
                              <td className="px-4 py-3 text-emerald-400 font-semibold">Estabilidad de Pagos</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {getLocalidadData(searchState.selectedZone?.localidad) && (
                      <>
                        <h3 className="text-sm font-extrabold tracking-tight mt-6 mb-3 text-white leading-tight">
                          Cruce de Amenidades Radiales
                        </h3>
                        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative z-10">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px] whitespace-nowrap">
                              <thead>
                                <tr className="bg-white/10 text-white font-extrabold text-[10px] uppercase tracking-wider">
                                  <th className="px-4 py-3">Categoría de Amenidad</th>
                                  <th className="px-4 py-3">Inventario Zonal Detectado</th>
                                  <th className="px-4 py-3">Perfil de Demanda Atraída</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 text-neutral-300 font-medium">
                                {getLocalidadData(searchState.selectedZone?.localidad)?.educacion_gran_formato && getLocalidadData(searchState.selectedZone?.localidad)?.educacion_gran_formato.length! > 0 && (
                                  <tr className="hover:bg-white/5 transition">
                                    <td className="px-4 py-3 font-bold text-white">Colegios / Universidades</td>
                                    <td className="px-4 py-3 whitespace-normal max-w-[200px]">{getLocalidadData(searchState.selectedZone?.localidad)?.educacion_gran_formato.join(", ")}</td>
                                    <td className="px-4 py-3">Estudiantes y Profesionales con Arraigo</td>
                                  </tr>
                                )}
                                {getLocalidadData(searchState.selectedZone?.localidad)?.clubes_sociales_deportivos && getLocalidadData(searchState.selectedZone?.localidad)?.clubes_sociales_deportivos.length! > 0 && (
                                  <tr className="hover:bg-white/5 transition">
                                    <td className="px-4 py-3 font-bold text-white">Clubes Sociales / Deportes</td>
                                    <td className="px-4 py-3 whitespace-normal max-w-[200px]">{getLocalidadData(searchState.selectedZone?.localidad)?.clubes_sociales_deportivos.join(", ")}</td>
                                    <td className="px-4 py-3">Premium Lifestyle y Wellness</td>
                                  </tr>
                                )}
                                {getLocalidadData(searchState.selectedZone?.localidad)?.corredores_gastronomicos && getLocalidadData(searchState.selectedZone?.localidad)?.corredores_gastronomicos.length! > 0 && (
                                  <tr className="hover:bg-white/5 transition">
                                    <td className="px-4 py-3 font-bold text-white">Restaurantes / Bares</td>
                                    <td className="px-4 py-3 whitespace-normal max-w-[200px]">{getLocalidadData(searchState.selectedZone?.localidad)?.corredores_gastronomicos.join(", ")}</td>
                                    <td className="px-4 py-3">WalkScore Alto / Parejas Jóvenes (DINK)</td>
                                  </tr>
                                )}
                                {getLocalidadData(searchState.selectedZone?.localidad)?.corredores_logisticos_estaciones && getLocalidadData(searchState.selectedZone?.localidad)?.corredores_logisticos_estaciones.length! > 0 && (
                                  <tr className="hover:bg-white/5 transition">
                                    <td className="px-4 py-3 font-bold text-white">Logística / Estaciones Servicio</td>
                                    <td className="px-4 py-3 whitespace-normal max-w-[200px]">{getLocalidadData(searchState.selectedZone?.localidad)?.corredores_logisticos_estaciones.join(", ")}</td>
                                    <td className="px-4 py-3">Conveniencia Vehicular y Abastecimiento</td>
                                  </tr>
                                )}
                                {getLocalidadData(searchState.selectedZone?.localidad)?.parques_metropolitanos && getLocalidadData(searchState.selectedZone?.localidad)?.parques_metropolitanos.length! > 0 && (
                                  <tr className="hover:bg-white/5 transition">
                                    <td className="px-4 py-3 font-bold text-white">Parques Metropolitanos</td>
                                    <td className="px-4 py-3 whitespace-normal max-w-[200px]">{getLocalidadData(searchState.selectedZone?.localidad)?.parques_metropolitanos.join(", ")}</td>
                                    <td className="px-4 py-3">Actividades al aire libre y familia</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 02 · Contexto Macroeconómico owner-friendly */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-md mb-6">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold block mb-2">
                       02 · DINÁMICA DEL MERCADO HOY
                    </span>
                    <h3 className="text-xl font-extrabold text-brand-dark tracking-tight mb-4">
                      ¿Por qué tu inmueble usado toma más valor?
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
                      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex gap-3">
                         <div className="bg-white p-2 rounded-lg border border-neutral-100 shadow-sm self-start">
                           <ArrowRight className="w-4 h-4 text-emerald-600" />
                         </div>
                         <div>
                           <div className="font-extrabold text-brand-dark text-sm">Menos Competencia Nueva</div>
                           <div className="text-xs text-neutral-500 font-medium mt-1">Los proyectos sobre planos han caído drásticamente. Menos construcción nueva significa que tu inmueble usado y listo para entrega gana un atractivo gigante para familias que buscan mudarse ya.</div>
                         </div>
                      </div>
                      
                      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex gap-3">
                         <div className="bg-white p-2 rounded-lg border border-neutral-100 shadow-sm self-start">
                           <Database className="w-4 h-4 text-brand-accent" />
                         </div>
                         <div>
                           <div className="font-extrabold text-brand-dark text-sm">Venta Inteligente</div>
                           <div className="text-xs text-neutral-500 font-medium mt-1">Negociar con datos claros evita jugar a los descuentos emocionales. El ajuste propuesto de 15% blinda tu liquidez frente a la inflación y las altas tasas bancarias, asegurando verdaderos interesados.</div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* 03 · Infraestructura Catalizadora dinámica via SQL-like mapping */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-md mb-6">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold block mb-2">
                      03 · OBRAS QUE IMPACTAN TU LOCALIDAD
                    </span>
                    <h3 className="text-xl font-extrabold text-brand-dark tracking-tight mb-4">
                      Proyectos y Megaobras en {searchState.selectedZone?.localidad || "Bogotá"}
                    </h3>

                    {/* Progress tracking bars mapped dynamically */}
                    <div className="space-y-6">
                      {searchState.selectedZone && getInfraForLocalidad(searchState.selectedZone.localidad).length > 0 ? (
                        getInfraForLocalidad(searchState.selectedZone.localidad).map((infra, idx) => (
                           <div key={idx} className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                             <div className="flex justify-between items-center mb-1 text-sm font-extrabold text-brand-dark">
                               <span>{infra.name}</span>
                               <span className="text-brand-accent bg-brand-light px-2 py-0.5 rounded-full text-xs">{infra.progress}% Avance</span>
                             </div>
                             <div className="text-xs text-neutral-500 font-medium mb-3">{infra.impact_desc}</div>
                             <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                               <div className="h-full bg-brand-accent rounded-full transition-all duration-1000" style={{ width: `${infra.progress}%` }} />
                             </div>
                           </div>
                        ))
                      ) : (
                         <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-center">
                           <AlertTriangle className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                           <div className="text-xs font-bold text-neutral-600">No se detectaron megaobras principales asignadas por cruce relacional (SQL-like) para esta localidad.</div>
                         </div>
                      )}
                    </div>
                  </div>

                  {/* 04 · Ecosistema Tier 1 y Perfiles */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-md mb-6">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold block mb-2">
                       04 · VENTAJAS DE TU ZONA
                    </span>
                    <h3 className="text-xl font-extrabold text-brand-dark tracking-tight mb-4">
                      Lo que hace única a tu ubicación
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex flex-col justify-between hover:shadow-md transition">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-extrabold flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Salud y Bienestar</span>
                          <div className="font-bold text-brand-dark text-xs mt-2" id="val-info-salud">
                            {searchState.selectedZone ? searchState.selectedZone.salud : "Hospitales de Alta Complejidad"}
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-3 font-medium bg-white px-2 py-1.5 rounded text-center border border-neutral-100">Cercanía a clínicas = arriendos para personal de salud o familias buscando seguridad.</p>
                      </div>

                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex flex-col justify-between hover:shadow-md transition">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-extrabold flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> Comercio y Vida</span>
                          <div className="font-bold text-brand-dark text-xs mt-2" id="val-info-comercio">
                            {searchState.selectedZone ? searchState.selectedZone.comercio : "Centros Comerciales y Entretenimiento"}
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-3 font-medium bg-white px-2 py-1.5 rounded text-center border border-neutral-100">Supermercados y ocio a pocos pasos elevan exponencialmente tu WalkScore.</p>
                      </div>

                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex flex-col justify-between hover:shadow-md transition">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-brand-accent font-extrabold flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5" /> ¿Quién quiere vivir aquí?</span>
                          <div className="font-bold text-brand-dark text-xs mt-2" id="val-info-perfil">
                            {searchState.selectedZone ? searchState.selectedZone.perfil : "Familias e inversionistas"}
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-3 font-medium bg-brand-light text-brand-dark px-2 py-1.5 rounded text-center border border-brand-accent/20">Este es el segmento exacto al que le presentaremos tu oferta.</p>
                      </div>
                    </div>
                  </div>

                  {/* 05 · Vectores de Desarrollo */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-md mb-6">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold block mb-2">
                      05 · VECTORES ESTRATÉGICOS DE DESARROLLO urb
                    </span>
                    <h3 className="text-xl font-extrabold text-brand-dark tracking-tight mb-4">
                      Frentes clave de valorización inmobiliaria
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className={`p-4 rounded-xl border transition ${activeVector === "norte" ? "bg-brand-dark text-white border-brand-dark" : "bg-neutral-50 text-brand-dark border-neutral-100"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-accent">Vector Norte</span>
                          {activeVector === "norte" && <span className="bg-brand-accent text-white text-[8px] font-bold py-0.5 px-2 rounded-full uppercase">Tu Polígono</span>}
                        </div>
                        <h4 className="font-bold text-sm mt-2">Norte Aspiracional</h4>
                        <p className="text-[10px] opacity-80 mt-1.5 leading-relaxed font-semibold">
                          Regiotram Norte y expansión de ejes viales. Alta preferencia residencial familiar y expatriados que buscan entornos consolidados.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border transition ${activeVector === "centro" ? "bg-brand-dark text-white border-brand-dark" : "bg-neutral-50 text-brand-dark border-neutral-100"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-accent">Vector Centro</span>
                          {activeVector === "centro" && <span className="bg-brand-accent text-white text-[8px] font-bold py-0.5 px-2 rounded-full uppercase">Tu Polígono</span>}
                        </div>
                        <h4 className="font-bold text-sm mt-2">Centro-Oriente Premium</h4>
                        <p className="text-[10px] opacity-80 mt-1.5 leading-relaxed font-semibold">
                          Línea de Metro, reconfiguración de la Caracas y renovación de San Victorino. Epicentro ideal para rentas cortas y jóvenes profesionales.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border transition ${activeVector === "occidente" ? "bg-brand-dark text-white border-brand-dark" : "bg-neutral-50 text-brand-dark border-neutral-100"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-accent">Vector Occidente</span>
                          {activeVector === "occidente" && <span className="bg-brand-accent text-white text-[8px] font-bold py-0.5 px-2 rounded-full uppercase">Tu Polígono</span>}
                        </div>
                        <h4 className="font-bold text-sm mt-2">Corredor Logístico y Empresarial</h4>
                        <p className="text-[10px] opacity-80 mt-1.5 leading-relaxed font-semibold">
                          Regiotram de Occidente y Calle 13 ampliada. Tracción agresiva para vivienda multifamiliar e interés logístico altamente dinámico.
                        </p>
                      </div>
                    </div>

                    {/* Risk indicator */}
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3 mt-4">
                      <AlertTriangle className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                          Riesgo a vigilar: Fricción de Oferta Especulativa
                        </h5>
                        <p className="text-[11px] text-orange-700/90 mt-1 leading-relaxed font-medium">
                          Fijar el inmueble asumiendo únicamente valores agregados brutos de clasificados de corretaje web tradicionales estanca el patrimonio. Es imperativo calcular el coeficiente real de fricción para evitar meses inactivos de exposición al mercado.
                        </p>
                      </div>
                    </div>
                  </div>
                  

                </div>
              </div>
            </div>

            {/* Action buttons footer for unlocked view */}
              {searchState.unlocked && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-md text-center mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h4 className="text-base font-bold text-brand-dark">¿Listo para activar la colocación acelerada?</h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Coordinamos el listado inteligente del predio en el ecosistema ADD+ PropTech optimizado.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 w-full md:w-auto">
                    <button
                      onClick={handleReset}
                      className="flex-1 md:flex-initial text-xs font-bold border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 px-5 py-3 rounded-xl transition cursor-pointer"
                    >
                      Nueva Dirección
                    </button>
                    <a
                      href={`https://wa.me/573000000000?text=Hola%20ADD%2B,%20quiero%20conocer%20mas%20del%20analisis%20inmobiliario%20para%20mi%20${propertyType}%20en%20${searchState.searchedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-initial text-xs font-extrabold bg-brand-dark text-white px-5 py-3 rounded-xl hover:bg-neutral-800 shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Hablar por WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      )}

      {/* Corporate Technical Footer */}
      <footer className="bg-white border-t border-neutral-100 py-8 px-4 mt-12 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-display text-2xl font-black tracking-tight text-brand-dark">
              add<span className="text-brand-accent">+</span>
            </span>
            <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-widest">
              Corte Técnico Informativo — Junio 2026
            </p>
          </div>

          <div className="text-center md:text-right max-w-lg">
            <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
              Modelos de tasación y datos recopilados de: Cámara de Comercio de Bogotá (Radar de Eficiencia Logística), Empresa Metro de Bogotá (EMB), Instituto de Desarrollo Urbano (IDU) y micro-datos DANE. Los algoritmos AVM calculan de forma aproximada el valor del suelo con factores de fricción teóricos basados en mercados hipotecarios de la República de Colombia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline custom loader helper icon
function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
