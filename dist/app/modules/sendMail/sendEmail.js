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
exports.generateRandomPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const exceljs_1 = __importDefault(require("exceljs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = require("../../config");
// Utility function to generate a random password
const generateRandomPassword = () => {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
// Configure your email transporter
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // Use the correct email service
    auth: {
        user: config_1.config.EMAIL_USER,
        pass: config_1.config.EMAIL_PASSWORD,
    },
});
// Function to create an Excel file
function createExcelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Products');
        // Define columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
        ];
        // Add rows (replace with your data fetching logic)
        worksheet.addRow({ id: 1, name: 'Product 1', price: 10.99 });
        worksheet.addRow({ id: 2, name: 'Product 2', price: 15.99 });
        // Save to file
        yield workbook.xlsx.writeFile('product_data.xlsx');
    });
}
// Function to send an email
function sendEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createExcelFile();
        const mailOptions = {
            from: config_1.config.EMAIL_FROM,
            to: 'mostafizur0195@gmail.com',
            subject: 'Daily Product Data',
            text: 'Please find the attached product data file.',
            attachments: [
                {
                    filename: 'product_data.xlsx',
                    path: './product_data.xlsx',
                },
            ],
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log('Email sent successfully!');
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    });
}
// Function to get the current time in BST and schedule the job accordingly
function scheduleEmail() {
    const currentTime = (0, moment_timezone_1.default)().tz('Asia/Dhaka');
    const targetTime = moment_timezone_1.default.tz('17:32', 'HH:mm', 'Asia/Dhaka');
    // If current time is past the target time, schedule for the next day
    if (currentTime.isAfter(targetTime)) {
        targetTime.add(1, 'day');
    }
    // Log the scheduled time for debugging purposes
    console.log(`Scheduling email at ${targetTime.format('YYYY-MM-DD HH:mm:ss')} Bangladesh time`);
    // Schedule the job
    node_schedule_1.default.scheduleJob(targetTime.toDate(), () => {
        console.log('Executing scheduled job...');
        sendEmail().catch(console.error); // Ensure any errors are caught and logged
    });
}
// Call scheduleEmail function to set up the job
scheduleEmail();
