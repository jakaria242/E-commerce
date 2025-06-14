import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))
app.use(cookieParser());
app.use(express.static("public"));

// all router =====
import userRoute from "./routes/userRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import subCategoryRoute from "./routes/subCategoryRoute.js"

app.use("/api/v1", userRoute)
app.use("/api/v1", categoryRoute)
app.use("/api/v1", subCategoryRoute)

export{ app }





