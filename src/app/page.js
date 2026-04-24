"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useRef,
} from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  IconButton,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import axios from "axios";
import Swal from "sweetalert2";

import HistoriaClinicaTab from "./components/HistoriaClinicaTab";
import FliaYApodTab from "./components/FliaYApodTab";
import InterconsultaTab from "./components/InterconsultaTab";
import ResumenHCTab from "./components/ResumenHCTab";
import ClinicoTab from "./components/ClinicoTab";
import CrearPacienteModal from "./components/ModalCrearPaciente";
import ModalSubirFotoPaciente from "./components/modalSubirFotos";
import { useRouter, useSearchParams } from "next/navigation";
import ModalGaleriaFotosPaciente from "./components/ModalGaleriaFotosPaciente";

function PageLoading() {
  return (
    <Container maxWidth={false} sx={{ maxWidth: "100vw", padding: 0 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Panel — Pacientes
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    </Container>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cliente, setCliente] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabData, setTabData] = useState({});
  const [openCrearModal, setOpenCrearModal] = useState(false);
  const [openFotoModal, setOpenFotoModal] = useState(false);
  const [openGaleriaModal, setOpenGaleriaModal] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const lastFetchedPatientId = React.useRef(null);
  const isUrlSyncRef = React.useRef(false);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/pacientes");
        console.log("Pacientes cargados:", res.data);
        setPacientes(res.data);
      } catch (err) {
        console.error("Error al cargar pacientes:", err);
        setError("No se pudieron cargar los pacientes");
        Swal.fire("Error", "No se pudieron cargar los pacientes", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, []);

  useEffect(() => {
    const pacienteIdUrl = searchParams?.get("paciente");

    if (pacienteIdUrl && pacientes.length > 0) {
      const pacienteEncontrado = pacientes.find((p) => p.id === pacienteIdUrl);

      if (pacienteEncontrado) {
        isUrlSyncRef.current = true;

        setSelectedPaciente((prev) => {
          if (prev?.id === pacienteEncontrado.id) return prev;
          return {
            id: pacienteEncontrado.id,
            nombreVisible: pacienteEncontrado.nombre,
          };
        });
      }
    }
  }, [pacientes, searchParams]);

  useEffect(() => {
    if (!selectedPaciente?.id) {
      lastFetchedPatientId.current = null;
      return;
    }

    if (lastFetchedPatientId.current === selectedPaciente.id) {
      return;
    }

    if (!isUrlSyncRef.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("paciente") !== selectedPaciente.id) {
        params.set("paciente", selectedPaciente.id);
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${params}`,
        );
      }
    }
    isUrlSyncRef.current = false;

    const fetchDatosPaciente = async () => {
      try {
        console.log(" Cargando datos para paciente:", selectedPaciente.id);
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `/api/pacientes/datos?id=${selectedPaciente.id}`,
        );

        console.log(" Datos cargados:", res.data);
        setTabData({ general: res.data });

        lastFetchedPatientId.current = selectedPaciente.id;
      } catch (err) {
        console.error(" Error cargando datos:", err);
        setError("No se pudieron cargar los datos del paciente");
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos del paciente",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDatosPaciente();
  }, [selectedPaciente?.id]);

  const refreshPacienteData = useCallback(async () => {
    if (!selectedPaciente?.id) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `/api/pacientes/datos?id=${selectedPaciente.id}`,
      );
      setTabData({ general: res.data });
      return true;
    } catch (err) {
      console.error("Error refrescando datos:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedPaciente]);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Sesión cerrada", "", "success");
      }
    });
    handleUserMenuClose();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleOpenCrearModal = () => {
    setOpenCrearModal(true);
  };

  const handleCloseCrearModal = () => {
    setOpenCrearModal(false);
  };

  const handleOpenFotoModal = () => {
    setOpenFotoModal(true);
  };
  const handleCloseFotoModal = () => setOpenFotoModal(false);

  const handleCrearSuccess = async (nuevoId) => {
    try {
      setSincronizando(true);

      const res = await axios.get("/api/pacientes");
      setPacientes(res.data);

      const nuevoPaciente = res.data.find((p) => p.id === nuevoId);
      if (nuevoPaciente) {
        setSelectedPaciente((prev) => {
          if (prev?.id === nuevoPaciente.id) return prev;
          return {
            id: nuevoPaciente.id,
            nombreVisible: nuevoPaciente.nombre,
          };
        });
      }

      Swal.fire("Éxito", "Paciente creado correctamente", "success");
      handleCloseCrearModal();
    } catch (err) {
      console.error("Error post-creación:", err);
      Swal.fire(
        "Éxito",
        "Paciente creado (error al refrescar lista)",
        "success",
      );
    } finally {
      setSincronizando(false);
    }
  };

  const handleFotoUploadSuccess = async (metadata) => {
    setSincronizando(true);
    try {
      const exito = await refreshPacienteData();
      if (exito) {
        console.log("Datos actualizados tras subir foto:", metadata);
      }
    } finally {
      setSincronizando(false);
    }
  };

  const handleOpenGaleriaModal = () => {
    setOpenGaleriaModal(true);
  };

  const handleCloseGaleriaModal = () => setOpenGaleriaModal(false);

  const handleFotosDeleted = (count) => {
    if (count > 0) {
      setSincronizando(true);
      refreshPacienteData().finally(() => setSincronizando(false));
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "100vw", padding: 0 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Panel — Pacientes
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleUserMenuOpen}
              aria-label="user menu"
            >
              <AccountCircleIcon />
              <Typography ml={1}>{cliente?.nombre || "Usuario"}</Typography>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Autocomplete
            disablePortal
            options={pacientes.map((p) => ({
              id: p.id,
              nombreVisible: p.nombreVisible,
            }))}
            getOptionLabel={(option) => option?.nombreVisible || ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={selectedPaciente}
            onChange={(event, newValue) => {
              console.log("Nuevo valor seleccionado:", newValue);

              if (!newValue || !newValue.id) {
                if (selectedPaciente) {
                  setSelectedPaciente(null);
                  setTabData({});
                  lastFetchedPatientId.current = null;
                }
                return;
              }
              setSelectedPaciente((prev) => {
                if (prev?.id === newValue.id) return prev;
                return {
                  id: newValue.id,
                  nombreVisible: newValue.nombreVisible,
                };
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar paciente"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {sincronizando && (
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {selectedPaciente && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={handleOpenGaleriaModal}
                  startIcon={<PhotoLibraryIcon />}
                >
                  Ver Galería
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOpenFotoModal}
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Subir Foto
                </Button>
              </Box>
            )}

            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenCrearModal}
              sx={{ minWidth: 120 }}
            >
              Crear Paciente
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                <Tab label="Antecedentes" />
                <Tab label="Clínico Psicosocial" />
                <Tab label="Resumen HC" />
                <Tab label="Información Familiar / Apoderado" />
                <Tab label="Interconsulta" />
              </Tabs>
            </Box>

            {tabIndex === 0 && (
              <HistoriaClinicaTab
                paciente={{ ...selectedPaciente, ...tabData.general }}
                datos={tabData.general || {}}
              />
            )}
            {tabIndex === 1 && (
              <ClinicoTab
                paciente={{ ...selectedPaciente, ...tabData.general }}
                datos={tabData.general || {}}
              />
            )}
            {tabIndex === 2 && (
              <ResumenHCTab
                paciente={{ ...selectedPaciente, ...tabData.general }}
                datos={tabData.general || {}}
              />
            )}
            {tabIndex === 3 && (
              <FliaYApodTab
                paciente={{ ...selectedPaciente, ...tabData.general }}
                datos={tabData.general || {}}
              />
            )}
            {tabIndex === 4 && (
              <InterconsultaTab
                paciente={{ ...selectedPaciente, ...tabData.general }}
                datos={tabData.general || {}}
              />
            )}
          </>
        )}
      </Box>

      {openCrearModal && (
        <CrearPacienteModal
          open={openCrearModal}
          onClose={handleCloseCrearModal}
          onCreateSuccess={handleCrearSuccess}
        />
      )}

      {openFotoModal && selectedPaciente && (
        <ModalSubirFotoPaciente
          open={openFotoModal}
          onClose={handleCloseFotoModal}
          pacienteId={selectedPaciente.id}
          patientName={selectedPaciente.nombreVisible}
          onUploadSuccess={handleFotoUploadSuccess}
        />
      )}

      {openGaleriaModal && selectedPaciente && (
        <ModalGaleriaFotosPaciente
          open={openGaleriaModal}
          onClose={handleCloseGaleriaModal}
          pacienteId={selectedPaciente.id}
          patientName={selectedPaciente.nombreVisible}
          onDeleted={handleFotosDeleted}
        />
      )}
    </Container>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HomeContent />
    </Suspense>
  );
}
