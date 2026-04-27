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
import travelProposalRoutes from "./modules/siteSetting/travelProposal/travelProposal.routes";
import packageRoutes from "./modules/package/package.routes";

const app = express();

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "");
}

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://safarimade-frontend.vercel.app",
  "https://safaritripbooking.com",
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins].map(normalizeOrigin))];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
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
app.use("/api/travel-proposals", travelProposalRoutes);
app.use("/api/packages", packageRoutes);
console.log("[TravelProposal][Backend] route mounted at /api/travel-proposals");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => res.send("Welcome to API"));

app.use(errorHandler);

export default app;
