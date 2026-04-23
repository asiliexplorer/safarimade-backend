 
import dotenv from "dotenv";
dotenv.config();  

import app from "./app";
import { connectDB } from "./config/mongoose";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set in the environment");
}

connectDB(MONGO_URI)
  .then(async () => {
    // --- Ensure all collections and indexes are created ---
    const { UserModel } = await import("./modules/auth/auth.model");
    const ContactModel = (await import("./modules/siteSetting/contact/contact.model")).default;
    const FaqModel = (await import("./modules/siteSetting/faq/faq.model")).default;
    const FooterModel = (await import("./modules/siteSetting/footer/footer.model")).default;
    const { ReviewModel } = await import("./modules/siteSetting/reviews/review.model");
    const { SectionModel } = await import("./modules/siteSetting/sections/section.model");

    await Promise.all([
      UserModel.createCollection(),
      ContactModel.createCollection(),
      FaqModel.createCollection(),
      FooterModel.createCollection(),
      ReviewModel.createCollection(),
      SectionModel.createCollection(),
    ]);
    await Promise.all([
      UserModel.init(),
      ContactModel.init(),
      FaqModel.init(),
      FooterModel.init(),
      ReviewModel.init(),
      SectionModel.init(),
    ]);
    // --- End ensure collections/indexes ---

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Failed:", err));
