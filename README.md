# WebPacientes

Historia clínica de pacientes (Next.js 16 + MUI + Firebase).

## Desarrollo

```bash
npm install
npm run dev
```

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/lib/paciente/schema.js` | **Fuente de verdad del modelo**: secciones, campos, pestañas y MMSE. Formularios, validación, vistas y PDFs se arman desde acá. Para agregar un campo, se agrega solo en este archivo. |
| `src/lib/paciente/logica.js` | Reglas clínicas compartidas: edad calculada, puntaje MMSE, validaciones, cálculo de cambios. |
| `src/lib/paciente/migracion.js` | Traducción del modelo viejo (campos planos) al modelo unificado. |
| `src/lib/server/pacientesService.js` | Acceso a Firestore: alta, edición por sección con historial, evoluciones. |
| `src/lib/server/pdf/` | Generación de PDFs con pdf-lib (ajuste de línea, paginación, Roboto embebida). |
| `src/app/components/paciente/` | Componentes genéricos: vista y edición de secciones, evoluciones, historial. |

## Modelo de datos (schemaVersion 2)

Documento `pacientes/lista/nombresPacientes/{idAutogenerado}`:

```
datosPersonales  { nombreCompleto, dni, genero, fechaNacimiento, obraSocial, afiliadoNumero, fechaIngreso }
antecedentes     { cardiovascular: { ta, cardio, observaciones }, digestivo: {...}, ... }
examenFisico     { mental: {...}, facial: {...}, ... }
diagnostico      { enfermedadBase, fechaEnfermedadBase, enfermedadActual, antecedentesPatologicos }
tratamiento      { tratamientoBase, fechaTratamientoBase, tratamientoActual }
valoracionSocial / valoracionMental (MMSE: respuesta + puntaje por ítem) / valoracionFuncional
familia          { apoderadoNombre, apoderadoDni, apoderadoParentesco, residenteNombre, consentimientoTexto }
interconsulta    { fecha, especialidad, motivo, informe }
urlFoto, galeriaFotos, ultimaModificacion, creadoEn, actualizadoEn, schemaVersion
```

Subcolecciones (solo se agregan, nunca se editan ni borran):

- `evoluciones` → `{ texto, fecha, profesional, creadoEn }`
- `historial` → `{ seccion, cambios: [{ campo, anterior, nuevo }], profesional, creadoEn }`

La edad no se guarda: se calcula a partir de la fecha de nacimiento.
Las fechas clínicas se guardan como `YYYY-MM-DD`; las de sistema en ISO completo.

## Migración de datos existentes

La app lee pacientes del modelo viejo y los migra automáticamente la primera vez
que se edita algo de ellos. Para migrar toda la base de una vez:

```bash
# simulación (no escribe nada)
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run migrar
# aplicar (guarda un respaldo completo en ./backups antes de escribir)
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run migrar -- --aplicar
```

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pacientes` | Lista (id, nombre, DNI) |
| POST | `/api/pacientes/crear` | Alta (multipart: `datos` JSON + `file` opcional) |
| GET | `/api/pacientes/datos?id=` | Paciente completo + derivados (edad, MMSE) |
| PUT | `/api/pacientes/{id}/secciones/{seccion}` | Edita una sección y registra historial |
| GET/POST | `/api/pacientes/{id}/evoluciones` | Lista / agrega evolución |
| GET | `/api/pacientes/{id}/historial?campo=` | Historial de cambios |
| POST | `/api/exportador/{pestaña}` | PDF de la pestaña (`{ id }`) |

> Pendiente (fase de seguridad): autenticación. Hasta entonces, el profesional
> que figura en historial y evoluciones es el que se escribe en la barra superior.
