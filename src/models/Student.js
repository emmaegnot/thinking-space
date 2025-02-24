const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    classCode: { type: String, required: true } // This will link to a teacher
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;