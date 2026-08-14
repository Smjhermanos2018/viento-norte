// Respaldo automático semanal - Viento Norte
// Descarga las tablas de Supabase y las guarda como CSV en /backups

const SUPABASE_URL = "https://lhmyoayjwltklxvdxdzn.supabase.co";
const SUPABASE_KEY = "sb_publishable_duNAiIbyGBOECNnK67399g_JxC_78MF";
const fs = require("fs");

const tablas = ["condominio", "parcelas", "pagos", "gastos", "ingresos_extra", "abonos_deuda"];

function aCSV(filas) {
  if (!filas.length) return "";
  const columnas = Object.keys(filas[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lineas = [columnas.join(",")];
  for (const fila of filas) {
    lineas.push(columnas.map((c) => escape(fila[c])).join(","));
  }
  return lineas.join("\n");
}

async function main() {
  const fecha = new Date().toISOString().slice(0, 10);
  const carpeta = `backups/${fecha}`;
  fs.mkdirSync(carpeta, { recursive: true });

  for (const tabla of tablas) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) {
      console.error(`Error obteniendo ${tabla}:`, await res.text());
      continue;
    }
    const datos = await res.json();
    fs.writeFileSync(`${carpeta}/${tabla}.csv`, aCSV(datos));
    console.log(`Guardado ${tabla}.csv (${datos.length} filas)`);
  }
}

main();