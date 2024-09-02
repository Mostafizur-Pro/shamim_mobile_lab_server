"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const path = require("path");
const express = require("express");
const app = express();
const getImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
const getClientImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    // console.log('data', imageName)
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    "images", "client", imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
const getUserImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    "images", "user", imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
const getAdminImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    "images", "admin_image", imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
const getEmployeeImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    "images", "employee", imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
const getPaidImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    "images", "paidImage", imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
const getHallRoomPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, "..", "..", "..", "..", 
    // "uploads",
    "images", "hallRoomPost", imageName);
    const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
    res.set("Cache-Control", cacheControl);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("Image not found");
        }
    });
}));
exports.ImageController = {
    getImage,
    getClientImage,
    getUserImage,
    getAdminImage,
    getEmployeeImage,
    getPaidImage,
    getHallRoomPost,
};
