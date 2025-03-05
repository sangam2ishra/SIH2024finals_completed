import  express from "express";
import multer from "multer";
import { getfile, uploadfile } from "../controllers/pdfControllers.js";
const router=express.Router();


// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../files");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/upload-file',upload.single("file"),uploadfile);
router.get('/get-files',getfile);

export default router;