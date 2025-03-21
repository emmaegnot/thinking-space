const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classCode: { type: String, required: true },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null }
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;