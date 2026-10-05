const errorResponse = {
  description: "Error de la API",
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
};

const fileSchema = {
  type: "object",
  required: ["file"],
  properties: {
    file: { type: "string", format: "binary", description: "Archivo PDF, JPG, PNG o WEBP" }
  }
};

const userDocumentSchema = {
  type: "object",
  required: ["file", "documentType"],
  properties: {
    file: { type: "string", format: "binary", description: "Documento del usuario" },
    documentType: { type: "string", enum: ["DNI", "LICENSE", "ADDRESS", "OTHER"] }
  }
};

export default {
  openapi: "3.0.0",
  info: {
    title: "ShipNow API",
    version: "1.0.0",
    description: "API de gestión de envíos, usuarios y entregas con carga de documentos y comprobantes."
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Files", description: "Carga de documentos y comprobantes" }
  ],
  paths: {
    "/api/users/{id}/document": {
      post: {
        tags: ["Files"],
        summary: "Cargar documento de usuario",
        description: "Recibe un archivo multipart/form-data y el tipo de documento. El archivo se guarda en uploads/users/documents y sus metadatos se asocian al usuario.",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "multipart/form-data": { schema: userDocumentSchema } }
        },
        responses: {
          200: { description: "Documento cargado correctamente" },
          400: errorResponse,
          404: errorResponse,
          413: errorResponse,
          500: errorResponse
        }
      }
    },
    "/api/orders/{id}/proof": {
      post: {
        tags: ["Files"],
        summary: "Cargar comprobante de pedido",
        description: "Recibe un comprobante multipart/form-data y lo asocia al pedido indicado.",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "multipart/form-data": { schema: fileSchema } }
        },
        responses: {
          200: { description: "Comprobante asociado correctamente" },
          400: errorResponse,
          404: errorResponse,
          413: errorResponse,
          500: errorResponse
        }
      }
    },
    "/api/deliveries/{id}/proof": {
      post: {
        tags: ["Files"],
        summary: "Cargar comprobante de entrega",
        description: "Recibe un comprobante multipart/form-data y lo asocia a la entrega indicada.",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "multipart/form-data": { schema: fileSchema } }
        },
        responses: {
          200: { description: "Comprobante asociado correctamente" },
          400: errorResponse,
          404: errorResponse,
          413: errorResponse,
          500: errorResponse
        }
      }
    }
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "FILE_REQUIRED" },
              message: { type: "string", example: "El archivo es obligatorio" }
            }
          }
        }
      }
    }
  }
};
