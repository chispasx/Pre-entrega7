import mongoose from "mongoose";
import { USER_ROLES } from "../constants/index.js";

const driverSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        default: USER_ROLES.DRIVER
    }

}, {
    timestamps: true
});

export default mongoose.model("Driver", driverSchema);