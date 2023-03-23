import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
// import cookieParse from 'cookie-parser'
import UserRouter from './routes/User.js'
import UploadRouter from './routes/upload.js'
import PostRouter from './routes/post.js'
import commentRouter from './routes/comment.js' 
const app = express();
dotenv.config()
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path  from 'path';

const __dirname = path.resolve();

global.__basedir = __dirname;

app.use(express.json({ limit: "30mb", extended: true }));
app.use(cors())
//app.use(morgan('common'))
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
app.use(bodyParser.json({
  type: ["application/x-www-form-urlencoded", "application/json"], // Support json encoded bodies
}));



app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use('/auth',UserRouter)
app.use('/upload',UploadRouter)
app.use('/post',PostRouter)
app.use('/comment',commentRouter)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.port, () => console.log(`Server running on port ${process.env.port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
