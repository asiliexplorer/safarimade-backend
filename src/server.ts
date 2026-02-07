 
import dotenv from "dotenv";
dotenv.config();  

import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose

  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

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
