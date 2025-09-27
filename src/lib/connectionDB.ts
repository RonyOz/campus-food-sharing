import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ debug: false });

const connectionString = process.env.MONGO_URI as string;

export const mongoDB = mongoose.connect(connectionString,
    { dbName: "CAMPUS_FOOD_SHARING_DB" }
).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("🚀 ~ :8 ~ error:", error);
});
