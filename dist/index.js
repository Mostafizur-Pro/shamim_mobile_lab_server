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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const exceljs_1 = __importDefault(require("exceljs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = require("./app/config");
dotenv_1.default.config();
// -----------------------------------------
// Email Configuration
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.config.EMAIL_USER,
        pass: config_1.config.EMAIL_PASSWORD,
    },
});
function createExcelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Products');
        try {
            const [rows] = yield config_1.pool.query('SELECT * FROM products');
            if (rows.length > 0) {
                const columnsToInclude = [
                    'product_id',
                    'brand',
                    'user_id',
                    'model',
                    'ime',
                    'receive_date',
                    'delivery_date',
                    'problem',
                    'status',
                    'bill',
                    'customer_name',
                    'customer_number',
                    'paid',
                    'due',
                    'created_at',
                ];
                // Dynamically create columns based on the data keys
                const columns = columnsToInclude.map((key) => ({
                    header: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                    key: key,
                    width: 20, // Set a default width or adjust based on key length
                }));
                // const columns = Object.keys(rows[0]).map((key) => ({
                //   header: key,
                //   key: key,
                //   width: 20, // Set a default width or adjust based on key length
                // }))
                worksheet.columns = columns;
                // Add rows to Excel sheet
                rows.forEach((row) => {
                    const filteredRow = columnsToInclude.reduce((acc, key) => {
                        acc[key] = row[key];
                        return acc;
                    }, {});
                    worksheet.addRow(filteredRow);
                });
                // rows.forEach((row: any) => {
                //   worksheet.addRow(row)
                // })
                yield workbook.xlsx.writeFile('product_data.xlsx');
            }
        }
        catch (error) {
            console.error('Error creating Excel file:', error);
        }
    });
}
function sendEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createExcelFile();
        const todayDate = (0, moment_timezone_1.default)().tz('Asia/Dhaka').format('YYYY-MM-DD');
        const mailOptions = {
            from: config_1.config.EMAIL_FROM,
            to: 'mostafizur0195@gmail.com',
            subject: `Daily Product Data - ${todayDate}`,
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
function scheduleEmail() {
    const currentTime = (0, moment_timezone_1.default)().tz('Asia/Dhaka');
    const targetTime = moment_timezone_1.default.tz('13:35', 'HH:mm', 'Asia/Dhaka');
    if (currentTime.isAfter(targetTime)) {
        targetTime.add(1, 'day');
    }
    console.log(`Scheduling email at ${targetTime.format('YYYY-MM-DD HH:mm:ss')} Bangladesh time`);
    node_schedule_1.default.scheduleJob(targetTime.toDate(), () => {
        console.log('Executing scheduled job...');
        sendEmail().catch(console.error);
    });
}
scheduleEmail();
// -----------------------------------------
const port = process.env.PORT || 3000;
// Create an HTTP server
const server = http_1.default.createServer(app_1.default);
// Create a new instance of Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Allow all origins for development; adjust this in production
        methods: ['GET', 'POST'],
    },
});
// Initialize Socket.IO (Optional: Add Socket.IO event listeners or handlers here)
// Start the HTTP server
server.listen(port, () => {
    const address = server.address();
    console.log(`Server is running on port ${address.port}`);
});
