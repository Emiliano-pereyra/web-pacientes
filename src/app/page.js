"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
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
import axios from "axios";
import Swal from "sweetalert2";

import HistoriaClinicaTab from "./components/HistoriaClinicaTab";
import FliaYApodTab from "./components/FliaYApodTab";
import InterconsultaTab from "./components/InterconsultaTab";
import ResumenHCTab from "./components/ResumenHCTab";
import ClinicoTab from "./components/ClinicoTab";
import CrearPacienteModal from "./components/ModalCrearPaciente";

const Home = () => {
  const [cliente, setCliente] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabData, setTabData] = useState({});
  const [openCrearModal, setOpenCrearModal] = useState(false); // Estado para el modal

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
    if (!selectedPaciente?.id) return;

    const fetchDatosPaciente = async () => {
      try {
        console.log(
          "Intentando cargar datos para paciente ID:",
          selectedPaciente.id
        );
        setLoading(true);
        const res = await axios.get(
          `/api/pacientes/datos?id=${selectedPaciente.id}`
        );

        console.log("Respuesta del backend:", res);
        console.log("Datos del paciente cargados:", res.data);

        setTabData({
          general: res.data,
        });
      } catch (err) {
        console.error("Error completo:", err);
        console.error(
          "Error al cargar datos del paciente:",
          err.response?.data || err.message
        );
        setError("No se pudieron cargar los datos del paciente");
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos del paciente",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDatosPaciente();
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

  const getTabData = (tabName) => {
    return tabData[tabName] || {};
  };

  // Función para abrir el modal
  const handleOpenCrearModal = () => {
    setOpenCrearModal(true);
  };

  // Función para cerrar el modal
  const handleCloseCrearModal = () => {
    setOpenCrearModal(false);
  };

  const handleCrearSuccess = (nuevoId) => {
    Swal.fire("Éxito", "Paciente creado correctamente", "success");
    setPacientes(prev => [...prev, { id: nuevoId, nombre: nuevoId }]);
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
              nombreVisible: p.nombre,
            }))}
            getOptionLabel={(option) => option?.nombreVisible || ""}
            value={selectedPaciente}
            onChange={(event, newValue) => {
              console.log("Nuevo valor seleccionado:", newValue);

              if (!newValue || !newValue.id) {
                setSelectedPaciente(null);
                setTabData({});
                return;
              }

              setSelectedPaciente({
                id: newValue.id,
                nombreVisible: newValue.nombreVisible,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar paciente"
                variant="outlined"
              />
            )}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenCrearModal}
            sx={{ minWidth: 120 }}
          >
            Crear Paciente
          </Button>
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
    </Container>
  );
};

export default Home;
