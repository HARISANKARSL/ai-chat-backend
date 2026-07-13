import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import routes from "./routes/index.js";

const app = express();

// Security
app.use(cors());
app.use(helmet());

// Performance
app.use(compression());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", routes);

export default app;