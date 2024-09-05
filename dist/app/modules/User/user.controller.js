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
exports.userController = exports.userFilterableFields = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../../config");
exports.userFilterableFields = ['searchTerm', 'title', 'syncId'];
const getAllUsers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchId, searchTerm } = req.query;
    // Base query
    let query = 'SELECT * FROM user';
    const queryParams = [];
    // Add conditions based on query parameters
    if (searchId) {
        query += ' WHERE id = ?';
        queryParams.push(searchId);
    }
    else if (searchTerm) {
        query += ' WHERE email LIKE ? OR name LIKE ? OR number LIKE ?';
        queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }
    // Execute query
    config_1.connection.query(query, queryParams, (error, results, fields) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error fetching users',
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Users fetched successfully',
            data: results,
        });
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    config_1.connection.query('SELECT * FROM user WHERE id = ?', [userId], (error, results, fields) => {
        if (error) {
            console.error('Error fetching user:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error fetching user',
                    },
                ],
            });
        }
        if (results.length === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: 'User not found',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'User not found with given ID',
                    },
                ],
            });
        }
        const user = results[0];
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User fetched successfully',
            data: user,
        });
    });
}));
// const createUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { name, number, role, email, password } = req.body
//     const formattedDate = moment.tz('Asia/Dhaka').format()
//     const hashedPassword = await bcrypt.hash(password, 10)
//     const newUser = {
//       name,
//       image:
//         'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
//       number,
//       email,
//       password: hashedPassword,
//       role: role || 'user',
//       action: 'pending',
//       created_at: formattedDate,
//       updated_at: formattedDate,
//     }
//     connection.query(
//       'INSERT INTO user SET ?',
//       newUser,
//       (error: any, results: any, fields: any) => {
//         if (error) {
//           console.error('Error creating user:', error)
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Internal Server Error',
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: 'Error creating user',
//               },
//             ],
//           })
//         }
//         const createdUserId = results.insertId
//           sendEmail(
//             'mostafizur0195@gmail.com',
//             'New Match Request',
//             `You have a new match request. View details at: `
//           ),
//         sendResponse(res, {
//           statusCode: httpStatus.CREATED,
//           success: true,
//           message: 'User created successfully',
//           data: { id: createdUserId },
//         })
//       }
//     )
//   }
// )
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, number, role, email, password } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    console.log('image', image);
    const formattedDate = moment_timezone_1.default.tz('Asia/Dhaka').format();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = {
        name,
        image: image ||
            'https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png',
        number,
        email,
        password: hashedPassword,
        role: role || 'user',
        action: 'pending',
        created_at: formattedDate,
        updated_at: formattedDate,
    };
    config_1.connection.query('INSERT INTO user SET ?', newUser, (error, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error('Error creating user:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error creating user',
                    },
                ],
            });
        }
        const createdUserId = results.insertId;
        // try {
        //   // Wait for email to be sent
        //   await sendEmail(
        //     'mostafizur0195@gmail.com',
        //     'New Match Request',
        //     `You have a new match request. View details at: [URL]`
        //   )
        // } catch (emailError) {
        //   console.error('Error sending email:', emailError)
        //   // Handle email sending error appropriately
        // }
        res.status(http_status_1.default.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: { id: createdUserId },
        });
    }));
}));
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { name, number, email, role } = req.body;
    const updatedFields = {};
    if (name !== undefined) {
        updatedFields.name = name;
    }
    if (number !== undefined) {
        updatedFields.number = number;
    }
    if (email !== undefined) {
        updatedFields.email = email;
    }
    if (role !== undefined) {
        updatedFields.role = role;
    }
    if (Object.keys(updatedFields).length === 0) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'No fields to update provided',
        });
    }
    config_1.connection.query('UPDATE user SET ? WHERE id = ?', [updatedFields, userId], (error, results, fields) => {
        if (error) {
            console.error('Error updating user:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error updating user',
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User updated successfully',
        });
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log('data', userId);
    config_1.connection.query('DELETE FROM user WHERE id = ?', [userId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting user:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error deleting user',
                    },
                ],
            });
        }
        if (results.affectedRows === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: 'User not found',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'User not found with given profile ID',
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User deleted successfully',
        });
    });
}));
exports.userController = {
    createUser,
    getUserById,
    deleteUser,
    updateUser,
    getAllUsers,
};
