const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    descritpion: { type: String, default: null },
    material_cost: { type: Number, default: null },
    work_cost: { type: Number, default: null },
    id: {type: Number,  unique: true}
});

module.exports = mongoose.model("service", serviceSchema);
