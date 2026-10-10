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
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

import PestanaPaciente from "./components/paciente/PestanaPaciente";
import ModalCrearPaciente from "./components/ModalCrearPaciente";
import ModalSubirFotoPaciente from "./components/modalSubirFotos";
import ModalGaleriaFotosPaciente from "./components/ModalGaleriaFotosPaciente";
import ProfesionalActual from "./components/ProfesionalActual";
import { PESTANAS } from "@/lib/paciente/schema";
import { api } from "@/lib/cliente/api";

function Barra() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Panel — Pacientes
        </Typography>
        <ProfesionalActual />
      </Toolbar>
    </AppBar>
  );
}

function Cargando() {
  return (
    <Container maxWidth={false} disableGutters>
      <Barra />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    </Container>
  );
}

function actualizarUrl(id) {
  const params = new URLSearchParams(window.location.search);
  if (id) params.set("paciente", id);
  else params.delete("paciente");
  const qs = params.toString();
  window.history.replaceState({}, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
}

function Inicio() {
  const searchParams = useSearchParams();
  const [pacientes, setPacientes] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [pacienteId, setPacienteId] = useState(() => searchParams?.get("paciente") || null);
  const [paciente, setPaciente] = useState(null);
  const [cargandoPaciente, setCargandoPaciente] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [modal, setModal] = useState(null); // "crear" | "foto" | "galeria"
  const pedidoActual = useRef(0);

  const cargarLista = useCallback(async () => {
    setCargandoLista(true);
    try {
      const lista = await api.listarPacientes();
      setPacientes(lista);
      return lista;
    } catch {
      Swal.fire("Error", "No se pudieron cargar los pacientes", "error");
      return [];
    } finally {
      setCargandoLista(false);
    }
  }, []);

  /** Trae el paciente desde la base. Ignora respuestas viejas si el usuario cambió de paciente. */
  const cargarPaciente = useCallback(async (id) => {
    const nro = ++pedidoActual.current;
    if (!id) {
      setPaciente(null);
      return;
    }
    setCargandoPaciente(true);
    setError(null);
    try {
      const p = await api.obtenerPaciente(id);
      if (nro === pedidoActual.current) setPaciente(p);
    } catch (e) {
      if (nro === pedidoActual.current) {
        setPaciente(null);
        setError(e.status === 404 ? "El paciente no existe" : "No se pudieron cargar los datos del paciente");
      }
    } finally {
      if (nro === pedidoActual.current) setCargandoPaciente(false);
    }
  }, []);

  useEffect(() => {
    cargarLista();
  }, [cargarLista]);

  useEffect(() => {
    actualizarUrl(pacienteId);
    cargarPaciente(pacienteId);
  }, [pacienteId, cargarPaciente]);

  const seleccionado = pacientes.find((p) => p.id === pacienteId) || null;

  const alCrear = async (nuevoId) => {
    setModal(null);
    await cargarLista();
    setTab(0);
    if (nuevoId === pacienteId) cargarPaciente(nuevoId);
    else setPacienteId(nuevoId); // queda seleccionado el paciente recién creado
    Swal.fire({ icon: "success", title: "Paciente creado", timer: 1500, showConfirmButton: false });
  };

  const alActualizar = (p) => {
    setPaciente(p);
    // si cambió el nombre o el DNI, refrescar el selector
    const item = pacientes.find((x) => x.id === p.id);
    const nombre = p.datosPersonales?.nombreCompleto;
    if (item && (item.nombreVisible !== nombre || item.dni !== p.datosPersonales?.dni)) cargarLista();
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Barra />

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Autocomplete
            options={pacientes}
            loading={cargandoLista}
            value={seleccionado}
            onChange={(_, nuevo) => setPacienteId(nuevo?.id || null)}
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
            renderInput={(params) => <TextField {...params} label="Buscar paciente por nombre o DNI" />}
            sx={{ flex: 1, maxWidth: 440 }}
          />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {paciente && (
              <>
                <Button variant="outlined" color="info" startIcon={<PhotoLibraryIcon />} onClick={() => setModal("galeria")}>
                  Ver galería
                </Button>
                <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} onClick={() => setModal("foto")}>
                  Subir foto
                </Button>
              </>
            )}
            <Button variant="contained" color="secondary" onClick={() => setModal("crear")}>
              Crear paciente
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!pacienteId && !error && <Alert severity="info">Seleccioná un paciente o creá uno nuevo.</Alert>}

        {pacienteId && cargandoPaciente && !paciente && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {paciente && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
                {PESTANAS.map((p) => (
                  <Tab key={p.id} label={p.titulo} />
                ))}
              </Tabs>
            </Box>
            <Box sx={{ opacity: cargandoPaciente ? 0.5 : 1, transition: "opacity .2s" }}>
              <PestanaPaciente
                key={`${paciente.id}-${PESTANAS[tab].id}`}
                pestana={PESTANAS[tab]}
                paciente={paciente}
                onActualizado={alActualizar}
                conEncabezadoEditable={tab === 0}
              />
            </Box>
          </>
        )}
      </Box>

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
    </Container>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Cargando />}>
      <Inicio />
    </Suspense>
  );
}
