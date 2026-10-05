import { expect } from "chai";
import request from "supertest";
import fs from "fs/promises";
import path from "path";
import app from "../src/app.js";
import connectDB, { disconnectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Order from "../src/models/Order.js";
import Delivery from "../src/models/Delivery.js";
import Driver from "../src/models/Driver.js";
import { UPLOAD_ROOT } from "../src/config/upload.config.js";

const pdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF");
const pngBuffer = Buffer.from([137,80,78,71,13,10,26,10]);
const createUser = async () => {
  const email = `test-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const res = await request(app).post("/api/users").send({ name: "Usuario Test", email, password: "123456" });
  expect(res.status).to.equal(201);
  return res.body.data;
};
const createOrder = async () => {
  const res = await request(app).post("/api/orders").send({ sender:"Juan", recipient:"Ana", origin:"Córdoba", destination:"Rosario", description:"Pedido de prueba" });
  expect(res.status).to.equal(201);
  return res.body.data;
};
const createDelivery = async (orderId) => {
  const driver = await Driver.create({ name:"Driver Test", email:`driver-${Date.now()}@example.com` });
  const res = await request(app).post("/api/deliveries").send({ order:orderId, driver:driver._id.toString() });
  expect(res.status).to.equal(201);
  return res.body.data;
};
const resetUploads = async () => {
  await fs.rm(UPLOAD_ROOT, { recursive:true, force:true });
  await fs.mkdir(UPLOAD_ROOT, { recursive:true });
};

before(async () => { await connectDB(); });
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Order.deleteMany({}), Delivery.deleteMany({}), Driver.deleteMany({})]);
  await resetUploads();
});
after(async () => {
  await Promise.all([User.deleteMany({}), Order.deleteMany({}), Delivery.deleteMany({}), Driver.deleteMany({})]);
  await resetUploads();
  await disconnectDB();
});

describe("ShipNow API - Pre-entrega Módulo 7", () => {
  describe("Base funcional", () => {
    it("obtiene usuarios correctamente", async () => {
      await createUser();
      const res = await request(app).get("/api/users?page=1&limit=10");
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an("array");
    });
    it("crea y consulta un pedido", async () => {
      const order = await createOrder();
      const res = await request(app).get(`/api/orders/${order._id}`);
      expect(res.status).to.equal(200);
      expect(res.body.data._id).to.equal(order._id);
    });
    it("accede a Swagger", async () => {
      const res = await request(app).get("/api/docs/");
      expect(res.status).to.equal(200);
      expect(res.text).to.include("Swagger UI");
    });
  });

  describe("Documentos de usuario", () => {
    it("carga correctamente un documento PDF y guarda sus metadatos", async () => {
      const user = await createUser();
      const res = await request(app)
        .post(`/api/users/${user._id}/document`)
        .field("documentType", "DNI")
        .attach("file", pdfBuffer, { filename:"dni.pdf", contentType:"application/pdf" });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.document).to.include.keys("originalName","generatedName","path","type","size","documentType","uploadedAt");
      expect(res.body.data.document.originalName).to.equal("dni.pdf");
      expect(res.body.data.document.documentType).to.equal("DNI");
      expect(res.body.data.document.type).to.equal("application/pdf");
      const absolute = path.resolve(res.body.data.document.path);
      const stat = await fs.stat(absolute);
      expect(stat.isFile()).to.equal(true);
    });

    it("rechaza la carga de documento cuando falta el archivo", async () => {
      const user = await createUser();
      const res = await request(app).post(`/api/users/${user._id}/document`).field("documentType", "DNI");
      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.error.code).to.equal("FILE_REQUIRED");
    });

    it("rechaza un tipo de documento inválido", async () => {
      const user = await createUser();
      const res = await request(app)
        .post(`/api/users/${user._id}/document`)
        .field("documentType", "PASSPORT_X")
        .attach("file", pdfBuffer, { filename:"doc.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal("INVALID_DOCUMENT_TYPE");
    });

    it("rechaza un tipo de archivo no permitido", async () => {
      const user = await createUser();
      const res = await request(app)
        .post(`/api/users/${user._id}/document`)
        .field("documentType", "DNI")
        .attach("file", Buffer.from("archivo ejecutable"), { filename:"archivo.exe", contentType:"application/x-msdownload" });
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal("INVALID_FILE_TYPE");
    });

    it("rechaza un documento que supera el tamaño máximo", async () => {
      const user = await createUser();
      const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 1);
      const res = await request(app)
        .post(`/api/users/${user._id}/document`)
        .field("documentType", "DNI")
        .attach("file", oversized, { filename:"grande.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal("FILE_TOO_LARGE");
    });

    it("rechaza un usuario inexistente y no deja el archivo guardado", async () => {
      const id = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .post(`/api/users/${id}/document`)
        .field("documentType", "DNI")
        .attach("file", pdfBuffer, { filename:"dni.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal("USER_NOT_FOUND");
    });
  });

  describe("Comprobantes de pedidos", () => {
    it("carga correctamente un comprobante y lo asocia al pedido", async () => {
      const order = await createOrder();
      const res = await request(app)
        .post(`/api/orders/${order._id}/proof`)
        .attach("file", pngBuffer, { filename:"comprobante.png", contentType:"image/png" });
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.proof).to.include.keys("originalName","generatedName","path","type","size","documentType","uploadedAt");
      expect(res.body.data.proof.documentType).to.equal("PROOF");
      expect(res.body.data.proof.originalName).to.equal("comprobante.png");
      await fs.stat(path.resolve(res.body.data.proof.path));
    });

    it("rechaza un comprobante sin archivo", async () => {
      const order = await createOrder();
      const res = await request(app).post(`/api/orders/${order._id}/proof`);
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal("FILE_REQUIRED");
    });

    it("rechaza un pedido inexistente al cargar comprobante", async () => {
      const res = await request(app)
        .post("/api/orders/507f1f77bcf86cd799439011/proof")
        .attach("file", pdfBuffer, { filename:"comprobante.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal("ORDER_NOT_FOUND");
    });
  });

  describe("Comprobantes de entregas", () => {
    it("carga correctamente un comprobante y lo asocia a la entrega", async () => {
      const order = await createOrder();
      const delivery = await createDelivery(order._id);
      const res = await request(app)
        .post(`/api/deliveries/${delivery._id}/proof`)
        .attach("file", pdfBuffer, { filename:"entrega.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.proof.documentType).to.equal("PROOF");
      expect(res.body.data.proof.type).to.equal("application/pdf");
      await fs.stat(path.resolve(res.body.data.proof.path));
    });

    it("rechaza una entrega inexistente al cargar comprobante", async () => {
      const res = await request(app)
        .post("/api/deliveries/507f1f77bcf86cd799439011/proof")
        .attach("file", pdfBuffer, { filename:"entrega.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal("DELIVERY_NOT_FOUND");
    });
  });

  describe("Errores generales de carga", () => {
    it("rechaza un campo de archivo diferente de file", async () => {
      const user = await createUser();
      const res = await request(app)
        .post(`/api/users/${user._id}/document`)
        .field("documentType", "DNI")
        .attach("document", pdfBuffer, { filename:"dni.pdf", contentType:"application/pdf" });
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal("FILE_FIELD_INVALID");
    });
  });
});
