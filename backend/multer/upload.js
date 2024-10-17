const express = require('express');
const multer = require('multer');
const path = require('path');

// Initialize router
const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Folder where files will be saved
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit for file size
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file'); // 'file' is the name of the form field for file upload

// Check file type (restricts uploads to images only)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload route
router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
    });
});

// Export the router
module.exports = router;
