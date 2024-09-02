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
exports.productController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = require("../../config");
const getAllProducts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const searchTerm = req.query.searchTerm;
    const searchId = parseInt(req.query.searchId, 10);
    const startIndex = (page - 1) * limit;
    let query = `SELECT * FROM products`;
    const queryParams = [];
    let whereClause = '';
    if (searchTerm) {
        whereClause += ` id LIKE ? OR title LIKE ? OR post LIKE ?`;
        queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }
    if (searchId) {
        if (whereClause) {
            whereClause += ' AND';
        }
        whereClause += ' id = ?';
        queryParams.push(searchId);
    }
    if (whereClause) {
        query += ` WHERE ${whereClause}`;
    }
    let grandTotalQuery = `SELECT COUNT(*) AS count FROM products`;
    if (whereClause) {
        grandTotalQuery += ` WHERE ${whereClause}`;
    }
    config_1.connection.query(grandTotalQuery, queryParams, (error, grandTotalResult) => {
        if (error) {
            console.error('Error fetching grand total:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    { path: req.originalUrl, message: 'Error fetching grand total' },
                ],
            });
        }
        const grandTotal = grandTotalResult && grandTotalResult.length > 0
            ? grandTotalResult[0].count
            : 0;
        query += ` ORDER BY id DESC LIMIT ?, ?`;
        queryParams.push(startIndex, limit);
        config_1.connection.query(query, queryParams, (error, results) => {
            if (error) {
                console.error('Error fetching question:', error);
                return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Internal Server Error',
                    errorMessages: [
                        {
                            path: req.originalUrl,
                            message: 'Error fetching question',
                        },
                    ],
                });
            }
            const totalCount = results.length;
            const response = {
                statusCode: http_status_1.default.OK,
                success: true,
                message: 'Question fetched successfully',
                totalCount: totalCount,
                grandTotal: grandTotal,
                data: results,
            };
            return res.status(response.statusCode).json(response);
        });
    });
}));
const getProductById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    config_1.connection.query('SELECT * FROM products WHERE id = ?', [postId], (error, results, fields) => {
        if (error) {
            console.error('Error fetching post:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error fetching post',
                    },
                ],
            });
        }
        if (results.length === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: 'Post not found',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Post not found with given ID',
                    },
                ],
            });
        }
        const post = results[0];
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Post fetched successfully',
            data: post,
        });
    });
}));
const createProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('brand', req.body.brand);
    const formattedDate = moment_timezone_1.default.tz('Asia/Dhaka').format();
    const newPost = {
        brand: req.body.brand,
        product_id: req.body.product_id || '1',
        model: req.body.model || null,
        ime: req.body.ime || null,
        image: req.body.image || null,
        receive_date: req.body.receive_date,
        delivery_date: req.body.delivery_date,
        problem: req.body.problem,
        status: req.body.status,
        bill: req.body.bill,
        customer_name: req.body.customer_name,
        customer_number: req.body.customer_number,
        paid: req.body.paid,
        due: req.body.due,
        created_at: formattedDate,
        updated_at: formattedDate,
    };
    // console.log('data', newPost)
    config_1.connection.query('INSERT INTO products SET ?', newPost, (error, results, fields) => {
        if (error) {
            console.error('Error creating newPost:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error creating newPost',
                    },
                ],
            });
        }
        const createdPostId = results.insertId;
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Post created successfully',
            data: { id: createdPostId },
        });
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { brand, model, delivery_date, problem, status, product_id, ime, image, receive_date, bill, customer_name, customer_number, paid, due, } = req.body;
    const updatedFields = {};
    // Add all fields to the update object if they are provided in the request
    if (brand !== undefined)
        updatedFields.brand = brand;
    if (model !== undefined)
        updatedFields.model = model;
    if (delivery_date !== undefined)
        updatedFields.delivery_date = delivery_date;
    if (problem !== undefined)
        updatedFields.problem = problem;
    if (status !== undefined)
        updatedFields.status = status;
    if (product_id !== undefined)
        updatedFields.product_id = product_id;
    if (ime !== undefined)
        updatedFields.ime = ime;
    if (image !== undefined)
        updatedFields.image = image;
    if (receive_date !== undefined)
        updatedFields.receive_date = receive_date;
    if (bill !== undefined)
        updatedFields.bill = bill;
    if (customer_name !== undefined)
        updatedFields.customer_name = customer_name;
    if (customer_number !== undefined)
        updatedFields.customer_number = customer_number;
    if (paid !== undefined)
        updatedFields.paid = paid;
    if (due !== undefined)
        updatedFields.due = due;
    // Check if there's anything to update
    if (Object.keys(updatedFields).length === 0) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'No fields to update provided',
        });
    }
    // Perform the update query
    config_1.connection.query('UPDATE products SET ? WHERE id = ?', [updatedFields, userId], (error, results, fields) => {
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
const deleteProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    config_1.connection.query('DELETE FROM products WHERE id = ?', [postId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting post:', error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Error deleting post',
                    },
                ],
            });
        }
        if (results.affectedRows === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: 'Post not found',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'Post not found with given profile ID',
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Post deleted successfully',
        });
    });
}));
exports.productController = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
