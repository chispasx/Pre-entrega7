# ShipNow — Pre-entrega Módulo 7
## Carga de archivos, documentos y comprobantes

Esta entrega incorpora a ShipNow la carga y gestión de archivos utilizando **Multer**.

La API permite recibir archivos mediante `multipart/form-data`, validarlos, almacenarlos en carpetas organizadas del servidor y asociarlos a usuarios, pedidos y entregas. En MongoDB se guardan únicamente los metadatos del archivo.

La implementación está integrada con el manejo centralizado de errores, logging, Swagger y tests funcionales.

---

# Objetivos de la entrega

- Configurar Multer de forma centralizada.
- Crear endpoints para carga de documentos y comprobantes.
- Validar existencia, tipo y tamaño de los archivos.
- Validar los campos requeridos.
- Validar el tipo de documento del usuario.
- Guardar los archivos en carpetas organizadas.
- Asociar cada archivo con su entidad correspondiente.
- Guardar únicamente metadatos en MongoDB.
- Integrar los errores de archivos con el sistema de errores general.
- Registrar eventos relevantes mediante el logger.
- Documentar los endpoints en Swagger.
- Agregar tests funcionales de carga.

---

# 1. Configuración de Multer

La configuración de Multer se encuentra centralizada en:

```text
src/config/upload.config.js
```

Los routers no contienen la configuración de almacenamiento, nombres, tipos permitidos ni límites de tamaño.

La configuración define:

- Carpeta raíz de uploads.
- Subcarpetas según el tipo de archivo.
- Nombre generado para cada archivo.
- Tipos MIME permitidos.
- Tamaño máximo.
- Cantidad máxima de archivos por solicitud.
- Manejo de errores de carga.

## Tipos de archivo permitidos

- PDF (`application/pdf`)
- JPG/JPEG (`image/jpeg`)
- PNG (`image/png`)
- WEBP (`image/webp`)

## Tamaño máximo

El tamaño máximo se configura mediante:

```env
MAX_FILE_SIZE=5242880
```

El valor corresponde a 5 MB.

## Campo esperado

Los endpoints esperan el archivo mediante el campo:

```text
file
```

Si se envía otro campo de archivo, la API responde con un error centralizado `FILE_FIELD_INVALID`.

---

# 2. Estructura de uploads

Los archivos se almacenan fuera del código fuente y se organizan de la siguiente manera:

```text
uploads/
├── users/
│   └── documents/
├── orders/
│   └── proofs/
└── deliveries/
    └── proofs/
```

La carpeta `uploads/` está incluida en `.gitignore`, por lo que los archivos cargados no se suben al repositorio.

Se incluyen únicamente archivos `.gitkeep` para conservar la estructura de carpetas.

---

# 3. Validaciones y errores centralizados

Las cargas utilizan el mismo middleware de errores de la API.

Se contemplan los siguientes errores específicos:

| Código | Situación |
|---|---|
| `FILE_REQUIRED` | No se envió el archivo |
| `INVALID_FILE_TYPE` | El tipo MIME no está permitido |
| `FILE_TOO_LARGE` | El archivo supera el máximo permitido |
| `FILE_FIELD_INVALID` | El campo multipart no es `file` |
| `INVALID_DOCUMENT_TYPE` | El tipo de documento no es válido |
| `USER_NOT_FOUND` | El usuario no existe |
| `ORDER_NOT_FOUND` | El pedido no existe |
| `DELIVERY_NOT_FOUND` | La entrega no existe |
| `FILE_SAVE_ERROR` | Error al guardar/asociar el archivo |

Todas las respuestas mantienen el formato general de la API:

```json
{
  "success": false,
  "error": {
    "code": "FILE_REQUIRED",
    "message": "El archivo es obligatorio"
  }
}
```

---

# 4. Documento de usuario

## Endpoint

```http
POST /api/users/:id/document
```

Recibe:

- ID del usuario en la URL.
- Archivo en el campo `file`.
- Tipo de documento en `documentType`.

## Tipos de documento permitidos

```text
DNI
LICENSE
ADDRESS
OTHER
```

## Ejemplo con cURL

```bash
curl -X POST "http://localhost:3000/api/users/ID/document" \
  -F "file=@dni.pdf" \
  -F "documentType=DNI"
```

Antes de guardar el archivo se verifica que el usuario exista y que el tipo de documento sea válido.

El archivo se guarda en:

```text
uploads/users/documents/
```

La respuesta devuelve el usuario actualizado y los metadatos del documento.

---

# 5. Comprobante de pedido

## Endpoint

```http
POST /api/orders/:id/proof
```

Recibe el comprobante mediante el campo:

```text
file
```

El pedido se verifica antes de asociar el archivo.

Los comprobantes se almacenan en:

```text
uploads/orders/proofs/
```

El metadato `documentType` se registra como:

```text
PROOF
```

---

# 6. Comprobante de entrega

## Endpoint

```http
POST /api/deliveries/:id/proof
```

Recibe el archivo mediante:

```text
file
```

La entrega se verifica antes de asociar el comprobante.

Los archivos se almacenan en:

```text
uploads/deliveries/proofs/
```

El metadato `documentType` se registra como `PROOF`.

---

# 7. Metadatos almacenados en MongoDB

El archivo completo no se almacena en MongoDB.

Para cada archivo se guarda únicamente:

```json
{
  "originalName": "dni.pdf",
  "generatedName": "1720000000000-uuid.pdf",
  "path": "uploads/users/documents/1720000000000-uuid.pdf",
  "type": "application/pdf",
  "size": 12345,
  "documentType": "DNI",
  "uploadedAt": "2026-10-03T00:00:00.000Z"
}
```

Los campos permiten identificar el archivo original, el nombre generado, su ubicación, tipo MIME, tamaño, tipo de documento y fecha de carga.

---

# 8. Integración con logging

Los eventos relevantes se registran mediante el logger de la aplicación.

Se registran, entre otros:

- Carga exitosa de documentos.
- Carga exitosa de comprobantes.
- Comprobantes asociados a pedidos.
- Comprobantes asociados a entregas.
- Intentos de tipos de archivo no permitidos.
- Errores durante la carga o guardado.

Los logs se generan en la carpeta `logs/`, que también está excluida del repositorio.

---

# 9. Swagger

La documentación se encuentra disponible en:

```text
GET /api/docs
```

Los endpoints de archivos están documentados como:

```text
multipart/form-data
```

Swagger indica:

- Campo del archivo: `file`.
- Campos adicionales requeridos.
- Tipos de documento permitidos.
- Tipos de archivo aceptados.
- Respuestas exitosas.
- Errores posibles.

Endpoints documentados:

```text
POST /api/users/{id}/document
POST /api/orders/{id}/proof
POST /api/deliveries/{id}/proof
```

---

# 10. Tests funcionales

Los tests se encuentran en:

```text
tests/api.test.js
```

La suite utiliza:

- Mocha.
- Chai.
- Supertest.
- MongoDB de testing.

Se prueban, entre otros casos:

- Carga correcta de documento de usuario.
- Verificación de metadatos.
- Verificación de que el archivo realmente se guarda.
- Falta del archivo.
- Tipo de documento inválido.
- Tipo de archivo no permitido.
- Archivo demasiado grande.
- Usuario inexistente.
- Carga correcta de comprobante de pedido.
- Pedido inexistente.
- Carga correcta de comprobante de entrega.
- Entrega inexistente.
- Campo de archivo incorrecto.

Los tests limpian la base de datos y la carpeta de uploads antes de cada prueba y al finalizar la suite, evitando depender de ejecuciones anteriores.

---

# Instalación

Instalar las dependencias:

```bash
npm install
```

No se incluye `node_modules` en el repositorio.

---

# Configuración

Tomar como referencia:

```text
.env.example
```

Variables principales:

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shipnow
MONGODB_TEST_URI=mongodb://localhost:27017/shipnow_test
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
LOG_LEVEL=info
```

Para los tests se utiliza:

```env
NODE_ENV=test
MONGODB_TEST_URI=mongodb://localhost:27017/shipnow_test
```

---

# Ejecución

Iniciar la API:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

Ejecutar los tests:

```bash
npm test
```

---

# Estructura principal

```text
ShipNow/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.config.js
│   │   ├── logger.js
│   │   └── upload.config.js
│   ├── constants/
│   │   └── documentTypes.js
│   ├── controllers/
│   ├── errors/
│   ├── middlewares/
│   │   └── upload.middleware.js
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
│       └── fileMetadata.js
├── tests/
│   └── api.test.js
├── uploads/
├── logs/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

# Checklist de la entrega

- [x] Multer instalado.
- [x] Configuración de Multer centralizada y separada de los routers.
- [x] Carpeta de uploads organizada por tipo de archivo.
- [x] Uploads incluidos en `.gitignore`.
- [x] Validación de archivo requerido.
- [x] Validación de tipo de archivo.
- [x] Validación de tamaño máximo.
- [x] Validación del campo `file`.
- [x] Validación de tipo de documento.
- [x] Endpoint de documentos de usuario.
- [x] Verificación de existencia del usuario.
- [x] Endpoint de comprobante de pedido.
- [x] Endpoint de comprobante de entrega.
- [x] Verificación de existencia de la entidad.
- [x] Guardado de metadatos en MongoDB.
- [x] No se almacena el archivo completo en MongoDB.
- [x] Errores de archivos integrados al error handler central.
- [x] Logging de cargas y errores relevantes.
- [x] Swagger con `multipart/form-data`.
- [x] Tests funcionales de carga.
- [x] No se incluye `node_modules`.
- [x] No se incluyen archivos cargados en el repositorio.

---

# Entrega

**Pre-entrega Módulo 7 — Carga de archivos, documentos y comprobantes**

La implementación incorpora la carga de documentos y comprobantes al flujo de ShipNow, manteniendo la validación, asociación con entidades, persistencia de metadatos, manejo centralizado de errores, logging, documentación Swagger y pruebas funcionales.
