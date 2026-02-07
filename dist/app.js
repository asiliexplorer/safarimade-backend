"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const errorHandler_1 = require("./common/middleware/errorHandler");
const swagger_1 = require("./config/swagger");
const contact_routes_1 = __importDefault(require("./modules/siteSetting/contact/contact.routes"));
const footer_routes_1 = __importDefault(require("./modules/siteSetting/footer/footer.routes"));
const faq_routes_1 = __importDefault(require("./modules/siteSetting/faq/faq.routes"));
const section_routes_1 = __importDefault(require("./modules/siteSetting/sections/section.routes"));
const review_routes_1 = __importDefault(require("./modules/siteSetting/reviews/review.routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/contact", contact_routes_1.default);
app.use("/api/footer", footer_routes_1.default);
app.use("/api/faqs", faq_routes_1.default);
app.use("/api/sections", section_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get("/", (req, res) => res.send("Welcome to API"));
app.use(errorHandler_1.errorHandler);
exports.default = app;
