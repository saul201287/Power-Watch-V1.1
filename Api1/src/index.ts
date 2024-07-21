/*
import express from "express";
import morgan from "morgan";
import { Signale } from "signale";
import * as dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import https from 'https';
import fs from "fs";
import { userRouter } from "./user/infraestructure/RouterUser";
import { planRouter } from "./planes/infraestructure/RoouterPlans";
import { paymentsRouter } from "./payments/infraestructure/PaymentsRouter";
import { routerProduct } from "./product/infraestructure/RouterProduct";

dotenv.config();
const app = express();
app.use(helmet.hidePoweredBy());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip ? ip.toString() : 'default';
  }
});

app.use(limiter);
app.use(express.json());
app.use("/user", userRouter);
app.use("/plan", planRouter);
app.use("/payments", paymentsRouter);
app.use("/product",routerProduct)

app.get("/", (req, res) => {
  res.send("API is running");
});
const options = {
  secrets: ["([0-9]{4}-?)+"],
};

const logger = new Signale(options);
const port = process.env.PORT;

app.listen(port, () => {
  logger.success("server listening on port:", port);
});
*/

import express from "express";
import morgan from "morgan";
import { Signale } from "signale";
import * as dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import https from "https";
import fs from "fs";
import { userRouter } from "./user/infraestructure/RouterUser";
import { planRouter } from "./planes/infraestructure/RoouterPlans";
import { paymentsRouter } from "./payments/infraestructure/PaymentsRouter";
import { routerProduct } from "./product/infraestructure/RouterProduct";

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

dotenv.config();
const app = express();
app.use(helmet.hidePoweredBy());
app.use(morgan("dev"));
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    return ip ? ip.toString() : "default";
  },
});

app.use((req, res, next) => {
  const forbiddenPaths = ["/autodiscover/autodiscover.json", "/Powershell"];
  if (forbiddenPaths.some((path) => req.path.includes(path))) {
    return res.status(403).send("Forbidden");
  }
  next();
});



app.use(limiter);
app.use(express.json());
app.use("/user", userRouter);
app.use("/plan", planRouter);
app.use("/payments", paymentsRouter);
app.use("/product", routerProduct);

app.get("/", (req, res) => {
  res.send("API is running");
});
const options = {
  secrets: ["([0-9]{4}-?)+"],
};

const optionsHTTPS = {
  key: fs.readFileSync(String(process.env.RUTA_KEY)),
  cert: fs.readFileSync(String(process.env.RUTA_CERTIFICADO)),
};

const logger = new Signale(options);

const port = process.env.PORT;

https.createServer(optionsHTTPS, app).listen(port, () => {
  logger.success("server listening on port:", port);
});
