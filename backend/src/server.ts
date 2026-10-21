import "dotenv/config";
import { buildApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const app = buildApp();

const server = app.listen(env.PORT, () => {
  logger.info(`HTTP server running on port ${env.PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Porta ${env.PORT} já está em uso. Finalize o processo antigo ou use: npm run dev:all`);
    process.exit(1);
  }

  logger.error(error, "Erro ao subir servidor HTTP");
  process.exit(1);
});
