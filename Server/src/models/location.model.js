import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["dataHall", "powerRoom", "coolingPlant"],
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
    capacity: {
      power: {
        type: Number,
        required: true,
      },
      cooling: {
        type: Number,
        required: true,
      },
      totalRacks: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: [true, "Created by field is required"],
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.pre("save", function (next) {
//   this.name = this.name.toLowerCase();
  if (this.capacity.power < 0) {
    throw new ApiError(404, "Capacity power must be a positive number");
  }
  next();
});


export default mongoose.model("Location", locationSchema, "locations");
