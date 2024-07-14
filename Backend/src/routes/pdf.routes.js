import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { heartScraper } from '../controllers/pdf.controller.js';
import { diabetesScraper } from '../controllers/pdf.controller.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post('/heart-scraper', upload.single('pdfFile'), heartScraper);

// Route for diabetes prediction
router.post('/diabetes-scraper', upload.single('pdfFile'), diabetesScraper);

export default router;
