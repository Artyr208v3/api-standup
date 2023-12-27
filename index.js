import http from "node:http";
import fs from "node:fs/promises";
import { sendError } from "./modules/send.js";
import { createFileIfNotExist, checkFilesExist } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = 8080;
const COMEDIANS = "./comedians.json";
export const CLIENTS = "./clients.json";

const startServer = async (port) => {
  if (!(await checkFilesExist(COMEDIANS))) {
    return;
  }

  await createFileIfNotExist(CLIENTS);

  const comediansData = await fs.readFile(COMEDIANS, "utf-8");
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PATCH, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.writeHead(204);
          res.end();
          return;
        }

        const segments = req.url.split("/").filter(Boolean);

        if (!segments.length) {
          sendError(res, 404, "Not found");
          return;
        }

        const [resource, id] = segments;

        if (req.method === "GET" && resource === "comedians") {
          handleComediansRequest(req, res, comedians, id);
          return;
        }

        if (req.method === "POST" && resource === "clients") {
          handleAddClient(req, res);
          return;
        }
        if (req.method === "GET" && resource === "clients" && id) {
          handleClientsRequest(req, res, id);
          return;
        }
        if (req.method === "PATCH" && resource === "clients" && id) {
          handleUpdateClient(req, res, id);
          return;
          //PATCH / clients/ticket
          // Обновление  клиента по номеру билета
        }
        res.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end("Not found");
      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end(`Ошибка сервера: ${error}`);
      }
    })
    .listen(port, () => {
      console.log(`Сервер запущен на http://localhost:${port}`);
    });
};

startServer(PORT);
