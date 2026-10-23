"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "sonner";
import { formatearFecha, formatearFechaHora, hoyISO } from "@/lib/paciente/logica";
import { api } from "@/lib/cliente/api";
import { enfocarPrimerError, useCambiosSinGuardar } from "@/lib/cliente/formularios";
import { agruparPorMes, borradorVigente, claveBorrador, filtrarEvoluciones } from "@/lib/cliente/evoluciones";
import { borrarPreferencia, guardarPreferencia, leerPreferencia } from "@/lib/cliente/preferencias";
import { plural } from "@/lib/cliente/formato";
import { useSesion } from "../auth/Sesion";

const POR_PAGINA = 10;
const MINIMO_PARA_BUSCAR = 3; // con pocas evoluciones el buscador sobra
const SIN_FILTROS = { texto: "", desde: "", hasta: "" };

/**
 * Evoluciones del paciente: se agregan, nunca se editan ni se borran.
 * Para corregir un error se agrega una nueva evolución aclarándolo.
 * `pedidoAbrir` (botón "Nueva evolución" del encabezado) abre el formulario; al atenderlo
 * se llama a `onPedidoAtendido` para que el padre lo apague.
 * Lo que se escribe queda como borrador en este equipo hasta guardarlo o descartarlo.
 */
export default function Evoluciones({ pacienteId, onCambio, pedidoAbrir = false, onPedidoAtendido, soloLectura = false }) {
  const { usuario } = useSesion() || {};
  const clave = claveBorrador(usuario?.uid ?? "anonimo", pacienteId);
  const leerBorrador = () => {
    const b = leerPreferencia(clave, null);
    return borradorVigente(b) ? b : null;
  };

  const [lista, setLista] = useState(null);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({ texto: "", fecha: hoyISO() });
  const [recuperado, setRecuperado] = useState(null); // fecha del borrador recuperado
  const [hayBorrador, setHayBorrador] = useState(() => !soloLectura && Boolean(leerBorrador()));
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [filtros, setFiltros] = useState(SIN_FILTROS);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const raiz = useRef(null);
  const texto = useRef(null);

  const pedirCierre = useCambiosSinGuardar(abierto && form.texto.trim() !== "" && !guardando);

  /** Recarga desde una acción del usuario (reintentar, después de guardar). */
  const cargar = useCallback(async () => {
    setError("");
    try {
      setLista(await api.listarEvoluciones(pacienteId));
    } catch (e) {
      setError(e.message);
    }
  }, [pacienteId]);

  // Carga inicial: el componente se vuelve a montar al cambiar de paciente (key en la página)
  useEffect(() => {
    let vigente = true;
    api
      .listarEvoluciones(pacienteId)
      .then((l) => vigente && setLista(l))
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [pacienteId]);

  const enfocar = () =>
    requestAnimationFrame(() => {
      raiz.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      texto.current?.focus({ preventScroll: true });
    });

  /** Abre el formulario: con el borrador guardado, si hay uno. */
  const prepararFormulario = () => {
    const b = leerBorrador();
    setForm(b ? { texto: b.texto, fecha: b.fecha || hoyISO() } : { texto: "", fecha: hoyISO() });
    setRecuperado(b ? b.guardadoEn : null);
    setErrores({});
    setAbierto(true);
  };

  const abrir = () => {
    prepararFormulario();
    enfocar();
  };

  // Pedido del botón "Nueva evolución" del encabezado: se abre el formulario
  // durante el render (si ya estaba abierto se conserva lo escrito) y después se avisa que se atendió.
  if (pedidoAbrir && !abierto) prepararFormulario();
  useEffect(() => {
    if (!pedidoAbrir) return;
    enfocar();
    onPedidoAtendido?.();
  }, [pedidoAbrir, onPedidoAtendido]);

  const cambiar = (cambios) => {
    const sig = { ...form, ...cambios };
    setForm(sig);
    if (sig.texto.trim()) {
      guardarPreferencia(clave, { ...sig, guardadoEn: Date.now() });
      setHayBorrador(true);
    } else {
      borrarPreferencia(clave);
      setHayBorrador(false);
    }
  };

  const descartarBorrador = () => {
    borrarPreferencia(clave);
    setHayBorrador(false);
    setRecuperado(null);
  };

  const cerrar = () => {
    descartarBorrador();
    setAbierto(false);
  };

  const guardar = async () => {
    setGuardando(true);
    setErrores({});
    try {
      await api.agregarEvolucion(pacienteId, form);
      descartarBorrador();
      setAbierto(false);
      await cargar();
      onCambio?.();
      toast.success("Evolución registrada");
    } catch (e) {
      const detalles = e.detalles || { texto: e.message };
      setErrores(detalles);
      enfocarPrimerError(detalles, raiz.current);
    } finally {
      setGuardando(false);
    }
  };

  const filtrar = (cambios) => {
    setFiltros((f) => ({ ...f, ...cambios }));
    setVisibles(POR_PAGINA);
  };

  const hayFiltros = filtros.texto.trim() !== "" || filtros.desde !== "" || filtros.hasta !== "";
  const filtradas = filtrarEvoluciones(lista, filtros);
  const grupos = agruparPorMes(filtradas.slice(0, visibles));
  const restantes = filtradas.length - visibles;

  return (
    <Paper ref={raiz} variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, scrollMarginTop: 120 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} gap={1}>
        <Typography variant="h6" component="h2" sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
          Evolución
        </Typography>
        {!abierto && !soloLectura && (
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={abrir}>
            {hayBorrador ? "Continuar borrador" : "Nueva evolución"}
          </Button>
        )}
      </Box>

      {!abierto && !soloLectura && hayBorrador && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Tenés una evolución sin guardar para este paciente. Tocá <strong>Continuar borrador</strong> para terminarla.
        </Alert>
      )}

      {abierto && !soloLectura && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "background.default", border: 1, borderColor: "divider", borderRadius: 1 }}>
          {recuperado && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    descartarBorrador();
                    setForm({ texto: "", fecha: hoyISO() });
                  }}
                >
                  Descartar
                </Button>
              }
            >
              Se recuperó lo que escribiste el {formatearFechaHora(new Date(recuperado).toISOString())}.
            </Alert>
          )}
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap", mb: 1 }}>
            <Box data-campo="fecha">
              <TextField
                label="Fecha"
                type="date"
                size="small"
                name="fecha"
                value={form.fecha}
                onChange={(e) => cambiar({ fecha: e.target.value })}
                error={Boolean(errores.fecha)}
                helperText={errores.fecha || " "}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
              Se registra como <strong>{usuario?.profesional || "—"}</strong>
            </Typography>
          </Box>
          <Box data-campo="texto">
            <TextField
              label="Evolución *"
              name="texto"
              multiline
              minRows={4}
              fullWidth
              inputRef={texto}
              value={form.texto}
              onChange={(e) => cambiar({ texto: e.target.value })}
              error={Boolean(errores.texto)}
              helperText={
                errores.texto ||
                "Se guarda un borrador en este equipo mientras escribís. Una vez guardada no se puede modificar: para corregir, agregá una nueva evolución."
              }
            />
          </Box>
          <Box sx={{ mt: 1.5, display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button onClick={() => pedirCierre(cerrar)} disabled={guardando}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={guardar}
              disabled={guardando}
              startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {guardando ? "Guardando…" : "Guardar evolución"}
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={cargar}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {!lista && !error && <CircularProgress size={24} aria-label="Cargando evoluciones" />}
      {lista?.length === 0 && <Typography color="text.secondary">Todavía no hay evoluciones registradas.</Typography>}

      {lista?.length >= MINIMO_PARA_BUSCAR && (
        <Box role="search" sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar en las evoluciones…"
            value={filtros.texto}
            onChange={(e) => filtrar({ texto: e.target.value })}
            sx={{ flex: "1 1 220px" }}
            slotProps={{
              htmlInput: { "aria-label": "Buscar en las evoluciones", spellCheck: false },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            size="small"
            type="date"
            label="Desde"
            value={filtros.desde}
            onChange={(e) => filtrar({ desde: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            type="date"
            label="Hasta"
            value={filtros.hasta}
            onChange={(e) => filtrar({ hasta: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {hayFiltros && (
            <IconButton aria-label="Limpiar la búsqueda" onClick={() => filtrar(SIN_FILTROS)}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      )}

      {hayFiltros && lista && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }} aria-live="polite">
          {filtradas.length === 0
            ? "Ninguna evolución coincide con la búsqueda."
            : `${plural(filtradas.length, "evolución", "evoluciones")} de ${lista.length}`}
        </Typography>
      )}

      {grupos.map((g) => (
        <Box key={g.clave} sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            component="h3"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 2 }}
          >
            {g.titulo}
          </Typography>
          <Box sx={{ borderLeft: 2, borderColor: "divider", ml: 0.75, pl: 2 }}>
            {g.items.map((e) => (
              <Box key={e.id} sx={{ mb: 2, position: "relative", "&:last-child": { mb: 0 } }}>
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    left: -21,
                    top: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
                <Typography variant="subtitle2">
                  {formatearFecha(e.fecha) || formatearFechaHora(e.creadoEn)} — {e.profesional}
                </Typography>
                {e.creadoEn && (
                  <Typography variant="caption" color="text.secondary">
                    Registrada el {formatearFechaHora(e.creadoEn)}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mt: 0.5, overflowWrap: "anywhere" }}>
                  {e.texto}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      {restantes > 0 && (
        <Button size="small" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
          Ver {Math.min(restantes, POR_PAGINA)} más ({restantes} anteriores)
        </Button>
      )}
    </Paper>
  );
}
