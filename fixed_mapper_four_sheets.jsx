"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

/************************* Constantes ************************/ 
export const SHEETS = [
  "Hoja 1 Boleta Alerta temprana",
  "Hoja 2 Boleta de seguimiento",
  "Hoja 3 Plan de atención",
  "Hoja 4 Base de datos",
] as const;

/************************* Tipos ***************************/
export type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "select" | "date";
  options?: string[];
};

export type Target = { sheet: typeof SHEETS[number]; addr: string };
export type Mapping = Record<string, Target[]>;

/************************* Campos ***************************/
export const FIELDS: FieldDef[] = [
  { key: "nombre", label: "Nombre", placeholder: "Juan Pérez", type: "text" },
  { key: "cedula", label: "Cédula", placeholder: "123456789", type: "text" },
  { key: "telefono", label: "Teléfono", placeholder: "88888888", type: "text" },
  { key: "edad", label: "Edad", placeholder: "15", type: "text" },
  { key: "seccion", label: "Sección", placeholder: "7-3", type: "text" },
  { key: "nivel", label: "Nivel", placeholder: "Sétimo", type: "text" },
  { key: "fecha", label: "Fecha", type: "date" },
  { key: "encargado", label: "Encargado", placeholder: "Nombre del encargado", type: "text" },
  { key: "telefono_encargado", label: "Teléfono Encargado", placeholder: "88888888", type: "text" },
  { key: "centro_educativo", label: "Centro Educativo", placeholder: "Nombre del centro", type: "text" },
  { key: "docente", label: "Docente", placeholder: "Nombre del docente", type: "text" },
  { key: "observaciones", label: "Observaciones", placeholder: "Texto", type: "text" },
  { key: "estado_persona", label: "Estado de la Persona Estudiante", type: "select", options: ["Riesgo de exclusión", "Excluida"] },
  { key: "dimension", label: "Dimensión", type: "select", options: [
      "Desempeno_educativo",
      "Convivencia_estudiantil",
      "Condición_económica",
      "Condición_familiar",
      "Riesgo_social",
      "Condición_cultural",
      "Condición_de_acceso",
      "Condición_de_salud",
    ] },
  { key: "tipo_alerta", label: "Tipo de Alerta", type: "select", options: [
      "Bajo rendimiento académico.",
      "Ausentismo a lecciones",
      "Repitencia / estudiante rezagado en alguna asignatura.",
      "Traslados repetitivos anualmente de la persona estudiante.",
      "Calificación de conducta reprobada.",
      "Hospitalización o convalecencia.",
      "Suspensión de la persona estudiante al centro educativo",
      "Ideación y tentativa de suicidio del estudiante.",
      "Lesiones autoinfligidas del estudiante.",
      "Trastornos alimenticios del estudiante.",
      "Condiciones de salud recurrentes a tratamiento.",
      "Persona estudiantes que presentan alergias medicamentosas, vectores y alimentarias.",
      "Afectación por situación de desastre de origen natural y/o antrópico o causado por el ser humano.",
    ] },
  { key: "estado_alerta", label: "Estado de la alerta", type: "select", options: ["Activada", "Proceso", "Espera", "Eliminada"] },
  { key: "oferta", label: "Oferta", type: "select", options: [
      "EDUCACIÓN ESPECIAL",
      "EDUCACIÓN PARA PERSONAS JÓVENES Y ADULTOS",
      "CICLO MATERNO INFANTIL Y TRANSICIÓN",
      "EDUCACIÓN TÉCNICA",
      "I Y II CICLOS DE LA EDUCACIÓN GENERAL BÁSICA",
      "III CICLO  Y EDUCACIÓN DIVERSIFICADA",
    ] },
  { key: "modalidad_epja", label: "Modalidad EPJA", type: "select", options: [
      "CINDEA CONVENCIONAL",
      "CINDEA-TÉCNICO DIURNO-COMERCIAL Y SERVICIOS",
      "COLEGIO ACADÉMICO NOCTURNO",
      "CONED-VIRTUAL",
      "ESCUELA NOCTURNA",
      "IPEC CONVENCIONAL",
      "IPEC-TÉCNICO DIURNO-COMERCIAL Y SERVICIOS",
      "IPEC-TÉCNICO DIURNO-INDUSTRIAL",
      "PLAN 2 AÑOS-COMERCIAL Y SERVICIOS",
      "PROYECTO O SEDE DE EDUCACIÓN ABIERTA",
    ] },
  { key: "direccion_regional", label: "Dirección Regional", type: "select", options: [
      "San José-Central","San José-Norte","San José Sur-Oeste","Desamparados","Los Santos","Puriscal","Pérez Zeledón","Alajuela","Occidente","San Carlos","Zona Norte-Norte","Cartago","Turrialba","Heredia","Sarapiquí","Liberia","Cañas","Nicoya","Santa Cruz","Puntarenas","Peninsular","Aguirre","Grande de Térraba","Coto","Limón","Sulá","Guápiles"
    ] },
  { key: "circuito", label: "Circuito", type: "select", options: ["01","02","03","04","05","06","07","08","09","10","11"] },
  { key: "fecha_activacion_at", label: "Fecha de Activación de la AT", type: "date" },
  { key: "fecha_cierre_at", label: "Fecha de cierre de la AT", type: "date" },
  { key: "docente_encargado_at", label: "Docente encargado de la AT", type: "text" },
  { key: "funcionario_saber", label: "Funcionario que registra en SABER", type: "text" },
  { key: "institucion_referida", label: "Institución a la que se refiere", type: "text" },
  { key: "codigo_institucional", label: "Código institucional", type: "text" },
];

/************************* Mapeo ***************************/
export const MAP: Mapping = {
  nombre: [
    { sheet: SHEETS[0], addr: "E2" },
    { sheet: SHEETS[2], addr: "C4" },
    { sheet: SHEETS[3], addr: "B10" },
  ],
  cedula: [
    { sheet: SHEETS[0], addr: "J2" },
    { sheet: SHEETS[2], addr: "C5" },
    { sheet: SHEETS[3], addr: "C10" },
  ],
  telefono: [{ sheet: SHEETS[0], addr: "L2" }],
  edad: [{ sheet: SHEETS[0], addr: "E3" }],
  seccion: [
    { sheet: SHEETS[0], addr: "J3" },
    { sheet: SHEETS[2], addr: "C6" },
    { sheet: SHEETS[3], addr: "E10" },
  ],
  nivel: [{ sheet: SHEETS[3], addr: "D10" }],
  fecha: [{ sheet: SHEETS[0], addr: "L3" }],
  encargado: [
    { sheet: SHEETS[0], addr: "E4" },
    { sheet: SHEETS[2], addr: "C7" },
  ],
  telefono_encargado: [{ sheet: SHEETS[0], addr: "K4" }],
  centro_educativo: [
    { sheet: SHEETS[0], addr: "E5" },
    { sheet: SHEETS[3], addr: "D4" },
  ],
  docente: [{ sheet: SHEETS[0], addr: "K5" }],
  observaciones: [{ sheet: SHEETS[1], addr: "B16" }],
  tipo_alerta: [{ sheet: SHEETS[3], addr: "H10" }],
  estado_persona: [{ sheet: SHEETS[3], addr: "F10" }],
  estado_alerta: [{ sheet: SHEETS[3], addr: "I10" }],
  dimension: [{ sheet: SHEETS[3], addr: "G10" }],
  fecha_activacion_at: [
    { sheet: SHEETS[1], addr: "G28" },
    { sheet: SHEETS[3], addr: "J10" },
  ],
  fecha_cierre_at: [
    { sheet: SHEETS[1], addr: "G29" },
    { sheet: SHEETS[3], addr: "K10" },
  ],
  docente_encargado_at: [{ sheet: SHEETS[1], addr: "G30" }],
  funcionario_saber: [{ sheet: SHEETS[1], addr: "G31" }],
  institucion_referida: [{ sheet: SHEETS[2], addr: "B18" }],
  codigo_institucional: [{ sheet: SHEETS[3], addr: "D5" }],
  direccion_regional: [{ sheet: SHEETS[3], addr: "H4" }],
  circuito: [{ sheet: SHEETS[3], addr: "H5" }],
  oferta: [{ sheet: SHEETS[3], addr: "D6" }],
  modalidad_epja: [{ sheet: SHEETS[3], addr: "H6" }],
};

/************************* Generación XLSX ***************************/
function formatDateToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function generateWorkbook(values: Record<string, string>) {
  const wb = XLSX.utils.book_new();
  const emptyGrid = [[""]];
  for (const sheet of SHEETS) {
    const ws = XLSX.utils.aoa_to_sheet(emptyGrid);
    XLSX.utils.book_append_sheet(wb, ws, sheet.slice(0, 31));
  }

  for (const [fieldKey, targets] of Object.entries(MAP)) {
    let val = values[fieldKey] ?? "";
    if (fieldKey.includes("cedula") || fieldKey.includes("telefono")) {
      val = val.replace(/-/g, "");
    }
    if (fieldKey.includes("fecha")) {
      val = formatDateToDDMMYYYY(val);
    }
    for (const t of targets) {
      const ws = wb.Sheets[t.sheet];
      if (!ws) continue;
      (ws as any)[t.addr] = { t: "s", v: String(val) };
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
      const cell = XLSX.utils.decode_cell(t.addr);
      range.e.r = Math.max(range.e.r, cell.r);
      range.e.c = Math.max(range.e.c, cell.c);
      ws["!ref"] = XLSX.utils.encode_range(range);
    }
  }
  return wb;
}

/************************* UI ******************************/
export default function FixedMapperFourSheets() {
  const initialValues = useMemo(() => {
    const v: Record<string, string> = {};
    for (const f of FIELDS) {
      if (f.type === "date") {
        v[f.key] = new Date().toISOString().slice(0, 10);
      } else {
        v[f.key] = "";
      }
    }
    return v;
  }, []);

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  function setValue(key: string, val: string) {
    setValues((s) => ({ ...s, [key]: val }));
  }

  function onGenerate() {
    const wb = generateWorkbook(values);
    XLSX.writeFile(wb, "Boletas_Rellenas.xlsx");
  }

  return (
    <div className="min-h-screen w-full p-6 bg-gray-50 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700">Generador de Alerta Temprana. UPRE</h1>
        <div className="text-sm text-gray-600">Las fechas se exportan en formato DD/MM/YYYY. Los datos se escribirán sin etiquetas ni guiones.</div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="bg-white border rounded-xl p-3 flex flex-col">
            <span className="text-sm font-medium">{f.label}</span>
            {f.type === "select" ? (
              <select
                className="mt-1 border rounded p-2"
                value={values[f.key]}
                onChange={(e) => setValue(f.key, e.target.value)}
              >
                <option value="">Seleccione…</option>
                {(f.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : f.type === "date" ? (
              <input
                type="date"
                className="mt-1 border rounded p-2"
                value={values[f.key]}
                onChange={(e) => setValue(f.key, e.target.value)}
              />
            ) : (
              <input
                className="mt-1 border rounded p-2"
                placeholder={f.placeholder || ""}
                value={values[f.key]}
                onChange={(e) => setValue(f.key, e.target.value)}
              />
            )}
            {MAP[f.key]?.length ? (
              <span className="mt-1 text-xs text-indigo-700">
                {MAP[f.key].map((t) => `${t.sheet}:${t.addr}`).join("  ·  ")}
              </span>
            ) : (
              <span className="mt-1 text-xs text-gray-400">(sin destino configurado)</span>
            )}
          </label>
        ))}
      </section>

      <div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onGenerate}>
          Generar Excel
        </button>
      </div>

      <footer className="text-xs text-gray-500">Fechas en formato DD/MM/YYYY. Cédulas y teléfonos sin guiones.</footer>
    </div>
  );
}
