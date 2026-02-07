import mongoose from "mongoose";

export async function connectDB(uri: string) {
  await mongoose.connect(uri, {
    // useNewUrlParser etc are default in recent mongoose versions
  });
  console.log("MongoDB connected");
}
