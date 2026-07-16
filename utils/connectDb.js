import mongoose from "mongoose";

const connectDb = async () => {
  console.log("🚀 connectDb called");

  try {
    console.log("URI Exists:", !!process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
};

export default connectDb;
