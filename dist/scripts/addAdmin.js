"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_model_1 = require("../modules/auth/auth.model");
dotenv_1.default.config();
function getArg(name) {
    const prefix = `--${name}=`;
    return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}
async function main() {
    const mongoUri = process.env.MONGO_URI;
    const email = getArg("email");
    const password = getArg("password");
    const name = getArg("name") || "Admin";
    if (!mongoUri) {
        throw new Error("MONGO_URI is not set in .env");
    }
    if (!email || !password) {
        throw new Error("Usage: npm run admin:add -- --email=admin@example.com --password=StrongPass123 --name=Admin");
    }
    await mongoose_1.default.connect(mongoUri);
    const existingUser = await auth_model_1.UserModel.findOne({ email });
    if (existingUser) {
        existingUser.password = password;
        existingUser.role = "admin";
        existingUser.name = name;
        await existingUser.save();
        console.log(`Updated existing user as admin: ${email}`);
    }
    else {
        await auth_model_1.UserModel.create({
            email,
            password,
            name,
            role: "admin",
        });
        console.log(`Created new admin user: ${email}`);
    }
}
main()
    .catch((error) => {
    console.error("Failed to add admin:", error.message || error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.connection.close();
});
