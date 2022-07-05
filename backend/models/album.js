import mongoose from "mongoose";

const { Schema } = mongoose;

const albumSchema = new Schema({
    albumTitle: { type: String, required: true },
    band: { type: String, required: true },
    albumYear: { type: Number, required: true, min: 1900, max: 2022 }
});

const Album = mongoose.model("Album", albumSchema);

export default Album;