import { promisify } from "util";
import multer, { diskStorage } from "multer";
const maxSize = 1024 * 1024;
let storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/images/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = promisify(uploadFile);
export default uploadFileMiddleware