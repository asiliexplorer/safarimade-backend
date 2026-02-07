import swaggerUi from "swagger-ui-express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./common/middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";
import contactRoutes from "./modules/siteSetting/contact/contact.routes";
import footerRoutes from "./modules/siteSetting/footer/footer.routes";
import faqRoutes from "./modules/siteSetting/faq/faq.routes";
import sectionRoutes from "./modules/siteSetting/sections/section.routes";
import reviewRoutes from "./modules/siteSetting/reviews/review.routes";

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://safaritripbooking.com"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => res.send("Welcome to API"));

app.use(errorHandler);

export default app;
