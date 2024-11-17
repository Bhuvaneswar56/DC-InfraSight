import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/user.model.js";
import CONFIG from "../config/config.js";
import { sendMail, emailVerificationMailgenContent } from "../utils/mail.js";
import jwt from "jsonwebtoken";

const registerInitialAdmin = asyncHandler(async (req, res) => {
    let { email, username, password, name, department } = req.body;

    let userFound = await userModel
        .findOne({ $or: [{ username }, { email }] })
        .select("email username");

    if (userFound) {
        throw new ApiError(409, `Admin ${userFound.username} already registered`);
    }

    let tempUser = {
        username,
        email,
        password,
        name,
        role: 'admin',
        department
    };

    let savedUser = new userModel(tempUser);
    await savedUser.save();

    res.status(200).json(new ApiResponse(200, "Admin Registration Successful"));

    sendMail({
        subject: "DC-InfraSight: Admin Registration Successful",
        email,
        mailgenContent: emailVerificationMailgenContent(username,password),
    });
});


const registerUser = asyncHandler(async (req, res) => {
    let { email, username, password, name, department } = req.body;

    let userFound = await userModel
        .findOne({ $or: [{ username }, { email }] })
        .select("email username");

    if (userFound) {
        throw new ApiError(409, `User ${userFound.username} already registered`);
    }

    let tempUser = {
        username,
        email,
        password,
        name,
        role: 'user',
        department
    };

    let savedUser = new userModel(tempUser);
    await savedUser.save();

    res.status(200).json(new ApiResponse(200, "User Registration Successful"));

    sendMail({
        subject: "DC-InfraSight: User Registration Successful",
        email,
        mailgenContent: emailVerificationMailgenContent(username, password),
    });
});


const login = asyncHandler(async (req, res) => {
    console.log("this is cookie", req.cookies);
    // username and password from the body and check if it exists
    // if there then fine, generate the token with _id as a payload and send response
    // if user doeesn't exist throw user

    let { username, password } = req.body;

    let userFound = await userModel.findOne({ username })
        .select("_id name email username password role");

    if (!userFound) {
        throw new ApiError(404, "Invalid Credentials");
    }

    let isPasswordMatch = await userFound.isPasswordCorrect(password);
    if (!isPasswordMatch) {
        throw new ApiError(404, "Invalid Credentials");
    }


    let token = userFound.generateAccessToken();

    let cookieOptions = {
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 day
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 day from now
        path: "/", // the cookie is available for all routes on the domain
        httpOnly: false, // Restricts the cookie to HTTP/HTTPS calls only,
        // preventing client-side JavaScript from accessing the cookie
        // domain: 'example.com'
        // encode:     (value) => customEncodingFunction(value)
        secure: false, // Only transmitted over HTTPS, if set to 'true'
        sameSite: "Lax", // Control cross-site request behavior
        signed: false, // if the cookie should be signed using the
        // secret provided when setting up the cookie-parser middleware
    };

    let user = {
        name: userFound.name,
        email: userFound.email,
        username: userFound.username
    };

    res
        .status(201)
        // .cookie("token", token, cookieOptions)
        .cookie("token", token)
        .json(
            new ApiResponse(201, "Login Successfull", { token, ...user })
        );
});

const changePassword = asyncHandler(async (req, res) => {
    let { userId } = req.payload;
    let { password, newPassword } = req.body;

    let userFound = await userModel
        .findById(userId)
        .select("_id username password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    let isPasswordMatch = await userFound.isPasswordCorrect(password);
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid Credentials");
    }

    userFound.password = newPassword;
    await userFound.save();

    res
        .status(200)
        .json(new ApiResponse(201, "Password changed successfully ..."));
});


const userLogout = asyncHandler(async (req, res) => {
    let { userId } = req.payload;

    let userFound = await userModel
        .findById(userId)
        .select("_id username password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    res
        .clearCookie("token")
        .status(200)
        .json(new ApiResponse(200, "Logout Successfull"));
});


const validateToken = asyncHandler(async (req, res) => {
    let { token } = req.body;

    if (!token) {
        throw new ApiError(401, "Token is required");
    }

    let decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY);

    // user exists or not
    let userFound = await userModel.findById(decoded.userId).select("-password");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    res.status(200).json(new ApiResponse(200, "Token is valid", userFound));
});

export {
    registerInitialAdmin,
    registerUser,
    login,
    changePassword,
    userLogout,
    validateToken,
};