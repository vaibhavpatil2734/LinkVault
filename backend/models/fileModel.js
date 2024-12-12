const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    code: { type: String, unique: true, required: true }, // Add this field
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
