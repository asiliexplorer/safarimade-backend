import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../modules/auth/auth.model";

dotenv.config();

function getArg(name: string): string | undefined {
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
    throw new Error(
      "Usage: npm run admin:add -- --email=admin@example.com --password=StrongPass123 --name=Admin"
    );
  }

  await mongoose.connect(mongoUri);

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    existingUser.password = password;
    existingUser.role = "admin";
    existingUser.name = name;
    await existingUser.save();

    console.log(`Updated existing user as admin: ${email}`);
  } else {
    await UserModel.create({
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
    await mongoose.connection.close();
  });
