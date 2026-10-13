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

## Manual de usuario

[`docs/manual/Manual de usuario - Pacientes.pdf`](docs/manual/). Se arma desde `docs/manual/manual.html`
(capturas en `img/`, con datos ficticios) y se regenera en Windows con Microsoft Edge:

```powershell
powershell -ExecutionPolicy Bypass -File docs/manual/generar.ps1
```

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/lib/paciente/schema.js` | **Fuente de verdad del modelo**: secciones, campos, pestañas y MMSE. Formularios, validación, vistas y PDFs se arman desde acá. Para agregar un campo, se agrega solo en este archivo. |
| `src/lib/paciente/logica.js` | Reglas clínicas compartidas: edad calculada, puntaje MMSE, validaciones, cálculo de cambios. |
| `src/lib/paciente/migracion.js` | Traducción del modelo viejo (campos planos) al modelo unificado. |
| `src/lib/server/pacientesService.js` | Acceso a Firestore: alta, edición por sección con historial, evoluciones. |
| `src/lib/server/pdf/` | Generación de PDFs con pdf-lib (ajuste de línea, paginación, Roboto embebida). Si quien imprime tiene matrícula (profesional, o secretaria/o de uno), todo PDF lleva al pie, a la derecha de la última página, el espacio para firmar con nombre y matrícula. |
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
fotoPerfilPath, galeriaFotos [{ id, path, tipo, ... }], estado, baja, ultimaModificacion, creadoEn, actualizadoEn, schemaVersion
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

### Baja del paciente

La baja es **lógica**: la historia clínica nunca se borra (Ley 26.529). Se guarda
`estado: "baja"` y `baja: { tipo, motivo, fecha, profesional, profesionalUid, fallecimiento?, institucion? }`.

| Tipo | Datos |
|---|---|
| Fallecimiento | Fecha (obligatoria); hora, lugar, causa, notificado a / cuándo y observaciones (opcionales, texto libre). Se guarda la edad al fallecer. |
| Alta · Traslado o derivación · Decisión del paciente o la familia · Otro | Motivo (texto libre, obligatorio); en traslado, institución de destino. |

- Un paciente de baja es de solo lectura (se ve e imprime; la API rechaza ediciones, evoluciones
  y archivos), no aparece en la lista salvo que se pida, y su PDF lo indica.
- Las bajas que no son por fallecimiento se pueden **reactivar** (reingreso). Un fallecimiento solo
  lo puede **anular un admin**, como error de carga y con motivo obligatorio.
- Todo queda en el historial del paciente y en el registro de accesos.

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
- Solo entran los usuarios de la colección `usuarios/{uid}`
  (`email, nombre, matricula, rol, profesionalUid, activo`).
- El servidor usa Firebase Admin; las reglas de Firestore y Storage niegan todo acceso directo.
- Las sesiones se cierran a la medianoche (hora del dispositivo) del día en que se ingresó, con
  aviso 10 minutos antes (`src/lib/cliente/cierreDiario.js`).

| Rol | Matrícula | Permisos | En los PDF figura |
|---|---|---|---|
| `admin` | Opcional | Todo, incluida la gestión de usuarios | Él mismo |
| `profesional` | Obligatoria | Ver y editar pacientes, evoluciones, fotos, PDF | Él mismo |
| `secretaria` | No lleva | Los mismos que profesional | Su profesional vinculado (nombre y matrícula) |

- Los admins gestionan usuarios desde la web en **/usuarios** (alta, rol, matrícula, profesional
  vinculado, activar/desactivar). Protecciones: nadie puede desactivarse ni quitarse el rol de admin
  a sí mismo, siempre queda al menos un admin activo y no se desactiva a un profesional con
  secretarias/os activas vinculadas.
- Una secretaria/o está vinculada a un profesional activo. Si no lo tiene (o está desactivado), no puede entrar.
- Historial y evoluciones registran siempre a la persona que hizo el cambio; si es secretaria/o,
  con la aclaración "secretaria/o de …".

```bash
npm run usuarios -- crear <email> --nombre "Nombre" --rol profesional --matricula "MN 1234"
npm run usuarios -- crear <email> --nombre "Nombre" --rol admin
npm run usuarios -- crear <email> --nombre "Nombre" --rol secretaria --profesional <email del profesional>
npm run usuarios -- listar
npm run usuarios -- asignar <email secretaria/o> <email profesional>
npm run usuarios -- matricula <email> "MN 1234"     # "-" para quitarla
npm run usuarios -- rol <email> profesional --matricula "MN 1234"
npm run usuarios -- desactivar <email>
```

## Registro de accesos

Colección `auditoria` (solo la escribe la API; nadie puede editarla ni borrarla desde la app).
Registra quién, cuándo, qué paciente, IP y navegador de: abrir la ficha, imprimir, ver archivos,
crear/editar paciente, evoluciones, subir/eliminar archivos y cambios de usuarios.

- Las lecturas repetidas (misma persona, mismo paciente, misma acción) dentro de 10 minutos se
  agrupan en un registro con `veces`; las modificaciones se registran una por una.
- Los admins lo consultan en **/usuarios → Registro de accesos** (filtrable por usuario) y en la
  ficha de cada paciente con el botón **Accesos**.
- Las consultas no requieren índices compuestos de Firestore.

Credenciales: en local, `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` en `.env.local`;
en Vercel, la variable `FIREBASE_SERVICE_ACCOUNT` con el JSON completo de la cuenta de servicio.
