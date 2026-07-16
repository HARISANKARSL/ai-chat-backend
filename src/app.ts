import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import routes from "./routes/index.js";
import errorHandler from "./common/middleware/errorHandler.js";

const app = express();

/**
 * Hide Express Signature
 */
app.disable("x-powered-by");

/**
 * Security Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: false,

    crossOriginEmbedderPolicy: false,

    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    referrerPolicy: {
      policy: "no-referrer",
    },

    frameguard: {
      action: "deny",
    },

    hidePoweredBy: true,

    noSniff: true,

    dnsPrefetchControl: {
      allow: false,
    },

    permittedCrossDomainPolicies: {
      permittedPolicies: "none",
    },
  })
);

/**
 * Enable Compression
 */
app.use(compression());

/**
 * Enable CORS
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/**
 * Body Parser
 */
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/**
 * API Routes
 */
app.use("/api/v1", routes);

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;