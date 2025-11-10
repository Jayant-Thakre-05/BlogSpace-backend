require('dotenv').config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require('./src/config/db')
const authRoutes = require('./src/routes/auth.routes')
const postRoutes = require('./src/routes/post.routes')
const cors = require("cors");
const aiRoutes = require('./src/routes/ai.routes');

connectDB();
let PORT = process.env.PORT || 4500;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: "https://blogspace05.netlify.app",
    credentials: true,
    
}));

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/ai', aiRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})