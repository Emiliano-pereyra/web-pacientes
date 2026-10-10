# WebPacientes

Historia clínica de pacientes (Next.js 16 + MUI + Firebase).

## Desarrollo

```bash
npm install
npm run dev
npm test        # tests de la lógica clínica (Vitest)
```

Los tests (`src/**/*.test.js`) cubren edad, MMSE, validaciones de DNI y fechas,
cálculo de cambios para el historial y la migración del modelo viejo.

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
fotoPerfilPath, galeriaFotos [{ id, path, tipo, ... }], ultimaModificacion, creadoEn, actualizadoEn, schemaVersion
```

### Fotos y archivos

En la base se guarda solo la **ruta** del archivo en Storage, nunca un enlace. Cuando
un usuario con sesión pide la ficha o la galería, la API genera **enlaces firmados que
vencen a los 30 minutos** (`src/lib/server/archivos.js`). No se crean tokens de descarga
permanentes. Para revocar los de archivos subidos antes de este cambio:

```bash
npm run revocar-enlaces              # simulación
npm run revocar-enlaces -- --aplicar
```

> Firebase Storage requiere el plan Blaze (facturación activa) en el proyecto.

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

Todas las rutas exigen `Authorization: Bearer <token de Firebase Auth>` de un usuario dado de alta y activo.
`GET /api/usuarios/yo` devuelve el usuario actual.

## Usuarios y acceso

- Login con Google o con email y contraseña (Firebase Auth). La contraseña se elige con
  "Crear o recuperar mi contraseña" en la pantalla de ingreso.
- Solo entran los usuarios de la colección `usuarios/{uid}` (`email, nombre, matricula, rol, activo`).
  Roles: `admin` y `profesional`.
- Historial, evoluciones y fotos registran al usuario autenticado (nombre + matrícula).
- El servidor usa Firebase Admin; las reglas de Firestore y Storage niegan todo acceso directo.

```bash
npm run usuarios -- crear <email> --nombre "Nombre" --matricula "MN 1234" --rol admin|profesional
npm run usuarios -- listar
npm run usuarios -- rol <email> profesional
npm run usuarios -- desactivar <email>
```

Credenciales: en local, `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` en `.env.local`;
en Vercel, la variable `FIREBASE_SERVICE_ACCOUNT` con el JSON completo de la cuenta de servicio.
