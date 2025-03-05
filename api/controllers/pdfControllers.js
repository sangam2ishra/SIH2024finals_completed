import multer from "multer";
import PdfDetails from "../models/pdfDetails.js";



// app.use("/files", express.static("files"));




// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./files");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Routes
export const uploadfile= async(req, res) => {
    console.log("hii");
    console.log(req);
    console.log(req.file);
    const { title } = req.body;
    const fileName = req.file.filename;
    try {
        await PdfDetails.create({ title, pdf: fileName });
        res.json({ status: "ok" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getfile=async(req, res) => {
    try {
        const data = await PdfDetails.find({});
        res.json({ status: "ok", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// app.get("/get-files", async (req, res) => {
//     try {
//         const data = await PdfDetails.find({});
//         res.json({ status: "ok", data });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get("/", (req, res) => {
//     res.send("Success!!!!!!");
// });

// Server
// const PORT = process.env.PORT || 3300
// app.listen(PORT, () => {
//     console.log(Server started on port ${PORT});
// });