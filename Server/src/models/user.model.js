// models/user.model.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import CONFIG from "../config/config.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Won't include password in queries by default
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        department: {
            type: String,
            required: [true, "Dept is required"],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, CONFIG.SALT_ROUNDS);
    next();
});

userSchema.post('save', (doc, next) => {
    console.log("-----------Running after saving to db")
    console.log(doc)
    console.log("------------------------------");
    next()
})

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password)
}

userSchema.methods.generateAccessToken = function () {
    let jwtPayload = { userId: this._id , role:this.role};
    let token = jwt.sign(jwtPayload, CONFIG.JWT_SECRET_KEY, { expiresIn: '1d' });
    return token;
}

export default mongoose.model("User", userSchema, "users");
