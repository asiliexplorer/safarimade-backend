  import mongoose from "mongoose";

  const UserSchema = new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      name: { type: String },

      role: {
        type: String,
        enum: ["admin", "customer", "company"],
        default: "customer",
      },

      // 👇 FIXED: Default removed so only company gets it manually
      companyStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: undefined,
      },
    },
    { timestamps: true }
  );

  export const UserModel = mongoose.model("User", UserSchema);
