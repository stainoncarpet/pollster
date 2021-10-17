const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");

const {sendConfirmationLinkEmail, sendSuccessfulConfirmationEmail, sendPasswordResetLink, sendSuccessfulPasswordResetEmail} = require("../utils/email.js");
const {issueToken, updateTokens} = require("../utils/jwt.js");
const UserModel = require("../models/userModel.js");
const mongoose = require("mongoose");

const createUser = async (data) => {
    try {
        const hashed = await bcrypt.hash(data.password, 8);
        const user = await UserModel.create({nickname: data.nickname, email: data.email, password: hashed});
        const mailToken = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.MAIL_TOKEN_LIFESPAN_IN_MINUTES * 60);
        sendConfirmationLinkEmail(user.email, user.nickname, mailToken);
        return {_id: user._id, nickname: user.nickname, email: user.email, token: mailToken}; // take out token
    } catch (error) {
        console.log("failed to create user", error.message);
        return null;
    }
};

const logInUser = async (data) => {
    try {
        const user = await UserModel.findOne({email: data.email});
        if (user && user.isConfirmed){
            const match = await bcrypt.compare(data.password, user.password);
            const authToken = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.AUTH_TOKEN_LIFESPAN_IN_DAYS);
            const refreshToken = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.REFRESH_TOKEN_LIFESPAN_IN_DAYS);
            return {match: match, user: {_id: user._id, nickname: user.nickname, email: user.email, authToken, refreshToken}};
        } else if (user && !user.isConfirmed) {
            const mailToken = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.MAIL_TOKEN_LIFESPAN_IN_MINUTES * 60);
            sendConfirmationLinkEmail(user.email, user.nickname, mailToken);
            return {match: true, user: null};
        } else {
            return {match: false, user: null};
        }
    } catch (error) {
        console.log("login failed", error.message);
        return {match: false, user: null};
    }
}

const confirmUser = async (token) => {
    try {
        return jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                const decoded2 = jwt.decode(token);
                const user = await UserModel.findById(mongoose.Types.ObjectId(decoded2._id));
                const token2 = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.MAIL_TOKEN_LIFESPAN_IN_MINUTES * 60);
                sendConfirmationLinkEmail(user.email, user.nickname, token2);
                return {success: false, msg: "Another email confirmation link has been sent to your mailbox", user: null};
            } else {
                const user = await UserModel.findById(mongoose.Types.ObjectId(decoded._id));
                user.isConfirmed = true;
                await user.save();

                sendSuccessfulConfirmationEmail(user.email, user.nickname);
                const authToken = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.AUTH_TOKEN_LIFESPAN_IN_DAYS);
                const refreshToken = issueToken({_id: user._id, nickname: user.nickname, email: user.email}, process.env.REFRESH_TOKEN_LIFESPAN_IN_DAYS);
                return {success: true, msg: "Email address confirmed", user: {_id: user._id, nickname: user.nickname, email: user.email, authToken, refreshToken}}
            }
        });
    } catch (error) {
        console.log("user confirmation failed", error.message);
        return {success: false, msg: "Email confirmation failed", user: null};
    }
};

const requestPasswordReset = async (email) => {
    try {
            const user = await UserModel.findOne({email: email});

            if (user) {
                const token = issueToken({email: user.email}, process.env.MAIL_TOKEN_LIFESPAN_IN_MINUTES * 60);

                sendPasswordResetLink(user.email, user.nickname, token);

                return {success: true, msg: "An email containing password reset link has been sent to your mailbox!"};
            } else {
                return {success: false, msg: "User with specified email does not exist"};
            }
    } catch (error) {
        console.log("password reset failed", error.message);
        return {success: false, msg: "Failed to reset password"};
    }
};

const confirmPasswordReset = async (token) => {
    try {
        return jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return {success: false, msg: "Reset link has expired, please try again", token: null};
            } else {
                await UserModel.findOne({email: decoded.email});
                return {success: true, msg: "Type in your new password", token: token}
            }
        });
    } catch (error) {
        console.log("password reset failed", error.message);
        return {success: false, msg: "Failed to reset password"};
    }
};

const setNewPassword = async (token, newPassword) => {
    try {
        return jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return {success: false, msg: "Reset link has expired"};
            } else {
                const user = await UserModel.findOne({email: decoded.email});
                const hashedPassword = await bcrypt.hash(newPassword, 8);
                user.password = hashedPassword;
                await user.save();

                sendSuccessfulPasswordResetEmail(decoded.email, user.nickname);

                return {success: true, msg: "Password reset successful!"}
            }
        });
    } catch (error) {
        console.log("password reset failed", error.message);
        return {success: false, msg: "Failed to reset password"};
    }
};

const updateAuth = async (data) => {
    try {
        const updatedTokens = updateTokens(data)
        return updatedTokens;
    } catch (error) {
        console.log("Token update error", error.message);
        return new Error(error);
    }
};

module.exports = {createUser, logInUser, confirmUser, requestPasswordReset, confirmPasswordReset, setNewPassword, updateAuth};