"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PrintIcon from "@mui/icons-material/Print";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import PestanaPaciente from "./components/paciente/PestanaPaciente";
import EncabezadoPaciente from "./components/paciente/EncabezadoPaciente";
import ListaPacientes from "./components/ListaPacientes";
import ModalCrearPaciente from "./components/ModalCrearPaciente";
import ModalSubirFotoPaciente from "./components/modalSubirFotos";
import ModalGaleriaFotosPaciente from "./components/ModalGaleriaFotosPaciente";
import ProfesionalActual from "./components/ProfesionalActual";
import { ConfirmacionProvider } from "./components/ui/Confirmacion";
import { SesionProvider, useSesion } from "./components/auth/Sesion";
import { PantallaIngreso, PantallaSinAcceso } from "./components/auth/PantallaIngreso";
import { PESTANAS } from "@/lib/paciente/schema";
import { api } from "@/lib/cliente/api";

const PESTANA_EVOLUCIONES = PESTANAS.findIndex((p) => p.conEvoluciones);

function Barra() {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 60 } }}>
        <LocalHospitalIcon color="primary" aria-hidden />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Pacientes
        </Typography>
        <ProfesionalActual />
      </Toolbar>
    </AppBar>
  );
}

function Cargando() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Barra />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress aria-label="Cargando" />
      </Box>
    </Box>
  );
}

/** Refleja en la URL el paciente y la pestaña abiertos (se pueden compartir y recargar). */
function actualizarUrl(id, pestanaId) {
  const params = new URLSearchParams(window.location.search);
  if (id) params.set("paciente", id);
  else params.delete("paciente");
  if (id && pestanaId) params.set("pestana", pestanaId);
  else params.delete("pestana");
  const qs = params.toString();
  window.history.replaceState({}, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
}

async function imprimir(pestana, paciente) {
  // La ventana se abre antes del await para que el navegador no la bloquee
  const ventana = window.open("", "_blank");
  const aviso = toast.loading(`Generando PDF de ${pestana.titulo.toLowerCase()}…`);
  try {
    const blob = await api.descargarPdf(pestana.id, paciente.id);
    const url = URL.createObjectURL(blob);
    if (ventana) ventana.location.href = url;
    else window.open(url, "_blank");
    toast.success("PDF listo", { id: aviso });
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (e) {
    ventana?.close();
    toast.error("No se pudo generar el PDF", { id: aviso, description: e.message });
  }
}

function Inicio() {
  const searchParams = useSearchParams();
  const [pacientes, setPacientes] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState("");
  const [pacienteId, setPacienteId] = useState(() => searchParams?.get("paciente") || null);
  const [paciente, setPaciente] = useState(null);
  const [cargandoPaciente, setCargandoPaciente] = useState(() => Boolean(searchParams?.get("paciente")));
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(() => {
    const i = PESTANAS.findIndex((p) => p.id === searchParams?.get("pestana"));
    return i >= 0 ? i : 0;
  });
  const [modal, setModal] = useState(null); // "crear" | "foto" | "galeria"
  const [pedidoEvolucion, setPedidoEvolucion] = useState(false);
  const pedidoActual = useRef(0);

  const mensajeErrorLista = (e) => e?.message || "No se pudieron cargar los pacientes";
  const errorPaciente = (e) =>
    e?.status === 404 ? "El paciente no existe" : "No se pudieron cargar los datos del paciente";

  /** Recarga la lista desde una acción del usuario (reintentar, después de crear o editar). */
  const cargarLista = useCallback(async () => {
    setCargandoLista(true);
    setErrorLista("");
    try {
      const lista = await api.listarPacientes();
      setPacientes(lista);
      return lista;
    } catch (e) {
      setErrorLista(mensajeErrorLista(e));
      return [];
    } finally {
      setCargandoLista(false);
    }
  }, []);

  /** Recarga el paciente abierto. Ignora respuestas viejas si el usuario cambió de paciente. */
  const cargarPaciente = useCallback(async (id) => {
    const nro = ++pedidoActual.current;
    setCargandoPaciente(true);
    setError(null);
    try {
      const p = await api.obtenerPaciente(id);
      if (nro === pedidoActual.current) setPaciente(p);
    } catch (e) {
      if (nro === pedidoActual.current) {
        setPaciente(null);
        setError(errorPaciente(e));
      }
    } finally {
      if (nro === pedidoActual.current) setCargandoPaciente(false);
    }
  }, []);

  // Carga inicial de la lista (cargandoLista arranca en true)
  useEffect(() => {
    let vigente = true;
    api
      .listarPacientes()
      .then((lista) => vigente && setPacientes(lista))
      .catch((e) => vigente && setErrorLista(mensajeErrorLista(e)))
      .finally(() => vigente && setCargandoLista(false));
    return () => {
      vigente = false;
    };
  }, []);

  // Carga del paciente elegido (elegir() ya marcó "cargando")
  useEffect(() => {
    if (!pacienteId) return;
    const nro = ++pedidoActual.current;
    const vigente = () => nro === pedidoActual.current;
    api
      .obtenerPaciente(pacienteId)
      .then((p) => vigente() && setPaciente(p))
      .catch((e) => {
        if (!vigente()) return;
        setPaciente(null);
        setError(errorPaciente(e));
      })
      .finally(() => vigente() && setCargandoPaciente(false));
  }, [pacienteId]);

  useEffect(() => {
    actualizarUrl(pacienteId, PESTANAS[tab]?.id);
  }, [pacienteId, tab]);

  const elegir = (id) => {
    if (id !== pacienteId) {
      pedidoActual.current++; // descarta respuestas pendientes del paciente anterior
      setPacienteId(id);
      setPaciente(null);
      setError(null);
      setCargandoPaciente(Boolean(id));
    }
    setTab(0);
    window.scrollTo({ top: 0 });
  };

  const seleccionado = pacientes.find((p) => p.id === pacienteId) || null;
  const pestana = PESTANAS[tab];

  const alCrear = async (nuevoId) => {
    setModal(null);
    await cargarLista();
    if (nuevoId === pacienteId) cargarPaciente(nuevoId);
    else elegir(nuevoId); // queda seleccionado el paciente recién creado
    toast.success("Paciente creado");
  };

  const alActualizar = (p) => {
    setPaciente(p);
    // si cambió el nombre o el DNI, refrescar el selector
    const item = pacientes.find((x) => x.id === p.id);
    const nombre = p.datosPersonales?.nombreCompleto;
    if (item && (item.nombreVisible !== nombre || item.dni !== p.datosPersonales?.dni)) cargarLista();
  };

  const nuevaEvolucion = () => {
    if (PESTANA_EVOLUCIONES >= 0) setTab(PESTANA_EVOLUCIONES);
    setPedidoEvolucion(true);
  };
  const atenderPedidoEvolucion = useCallback(() => setPedidoEvolucion(false), []);

  const acciones = paciente && (
    <>
      {PESTANA_EVOLUCIONES >= 0 && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={nuevaEvolucion}>
          Nueva evolución
        </Button>
      )}
      <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => imprimir(pestana, paciente)}>
        Imprimir {pestana.titulo.toLowerCase()}
      </Button>
      <Button variant="outlined" startIcon={<PhotoLibraryIcon />} onClick={() => setModal("galeria")}>
        Fotos
      </Button>
      <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setModal("foto")}>
        Subir archivo
      </Button>
    </>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Barra />

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
          {pacienteId && (
            <>
              <Button startIcon={<ArrowBackIcon />} onClick={() => elegir(null)}>
                Todos los pacientes
              </Button>
              <Autocomplete
                options={pacientes}
                loading={cargandoLista}
                value={seleccionado}
                onChange={(_, nuevo) => nuevo && elegir(nuevo.id)}
                getOptionLabel={(o) => o?.nombreVisible || ""}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                filterOptions={(opts, { inputValue }) => {
                  const q = inputValue.trim().toLowerCase();
                  return q ? opts.filter((o) => o.nombreVisible.toLowerCase().includes(q) || o.dni.includes(q)) : opts;
                }}
                renderOption={(props, o) => {
                  const { key, ...rest } = props;
                  return (
                    <li key={o.id} {...rest}>
                      <Box>
                        <Typography variant="body2">{o.nombreVisible}</Typography>
                        {o.dni && (
                          <Typography variant="caption" color="text.secondary">
                            DNI {o.dni}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Cambiar de paciente…" aria-label="Cambiar de paciente" />
                )}
                sx={{ flex: 1, minWidth: 220, maxWidth: 380 }}
              />
            </>
          )}
          <Box sx={{ flex: 1 }} />
          <Button variant={pacienteId ? "outlined" : "contained"} startIcon={<PersonAddIcon />} onClick={() => setModal("crear")}>
            Nuevo paciente
          </Button>
        </Box>

        {!pacienteId && (
          <ListaPacientes
            pacientes={pacientes}
            cargando={cargandoLista}
            error={errorLista}
            onReintentar={cargarLista}
            onElegir={elegir}
            onCrear={() => setModal("crear")}
          />
        )}

        {pacienteId && error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => cargarPaciente(pacienteId)}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {pacienteId && cargandoPaciente && !paciente && (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress aria-label="Cargando paciente" />
          </Box>
        )}

        {paciente && (
          <>
            <EncabezadoPaciente paciente={paciente} acciones={acciones} onAbrirGaleria={() => setModal("galeria")} />

            <Box
              sx={{
                position: "sticky",
                top: { xs: 56, sm: 60 },
                zIndex: 2,
                bgcolor: "background.default",
                borderBottom: 1,
                borderColor: "divider",
                mb: 2,
              }}
            >
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
                {PESTANAS.map((p) => (
                  <Tab key={p.id} label={p.titulo} />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ opacity: cargandoPaciente ? 0.6 : 1, transition: "opacity 150ms ease" }}>
              <PestanaPaciente
                key={`${paciente.id}-${pestana.id}`}
                pestana={pestana}
                paciente={paciente}
                onActualizado={alActualizar}
                conEncabezadoEditable={tab === 0}
                pedidoNuevaEvolucion={pedidoEvolucion}
                onPedidoAtendido={atenderPedidoEvolucion}
              />
            </Box>
          </>
        )}
      </Container>

      {modal === "crear" && (
        <ModalCrearPaciente open onClose={() => setModal(null)} onCreateSuccess={alCrear} />
      )}

      {modal === "foto" && paciente && (
        <ModalSubirFotoPaciente
          open
          onClose={() => setModal(null)}
          pacienteId={paciente.id}
          patientName={paciente.datosPersonales?.nombreCompleto}
          onUploadSuccess={() => cargarPaciente(paciente.id)}
        />
      )}

      {modal === "galeria" && paciente && (
        <ModalGaleriaFotosPaciente
          open
          onClose={() => setModal(null)}
          pacienteId={paciente.id}
          patientName={paciente.datosPersonales?.nombreCompleto}
          onDeleted={(n) => n > 0 && cargarPaciente(paciente.id)}
        />
      )}
    </Box>
  );
}

/** Muestra el panel solo a usuarios dados de alta; si no, la pantalla de ingreso. */
function ConSesion() {
  const { estado } = useSesion();
  if (estado === "cargando") return <Cargando />;
  if (estado === "sinSesion") return <PantallaIngreso />;
  if (estado === "sinAcceso") return <PantallaSinAcceso />;
  return (
    <Suspense fallback={<Cargando />}>
      <Inicio />
    </Suspense>
  );
}

export default function Home() {
  return (
    <SesionProvider>
      <ConfirmacionProvider>
        <ConSesion />
      </ConfirmacionProvider>
    </SesionProvider>
  );
}
