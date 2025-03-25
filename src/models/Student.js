const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    classCode: { type: String, required: true }, // This will link to a teacher
    ushape: String,
    ucolor: String,
    uword: String,
    uadditionalWords: [String], 
    uforce: Number, 
    umood: String,
    whatHappened: String,
    utimestamp: { type: Date, default: Date.now },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
StudentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;