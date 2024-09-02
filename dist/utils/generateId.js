"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNextEmployeeProfileId = exports.generateNextAdminProfileId = exports.generateNextClientProfileId = exports.generateNextUserProfileId = void 0;
const config_1 = require("../app/config");
const generateNextUserProfileId = () => {
    return new Promise((resolve, reject) => {
        config_1.connection.query("SELECT MAX(profile_id) AS max_profile_id FROM users", (error, results, fields) => {
            if (error) {
                console.error("Error generating next user profile ID:", error);
                reject(error);
            }
            else {
                const maxProfileId = results[0].max_profile_id;
                const nextProfileId = maxProfileId
                    ? parseInt(maxProfileId.replace("BP24U", "")) + 1
                    : 1;
                const generatedId = `BP24U${nextProfileId
                    .toString()
                    .padStart(4, "0")}`;
                resolve(generatedId);
            }
        });
    });
};
exports.generateNextUserProfileId = generateNextUserProfileId;
const generateNextClientProfileId = () => {
    return new Promise((resolve, reject) => {
        config_1.connection.query("SELECT MAX(profile_id) AS max_profile_id FROM client_data", (error, results, fields) => {
            if (error) {
                console.error("Error generating next client profile ID:", error);
                reject(error);
            }
            else {
                const maxProfileId = results[0].max_profile_id;
                const nextProfileId = maxProfileId
                    ? parseInt(maxProfileId.replace("BP24C", "")) + 1
                    : 1;
                const generatedId = `BP24C${nextProfileId
                    .toString()
                    .padStart(4, "0")}`;
                resolve(generatedId);
            }
        });
    });
};
exports.generateNextClientProfileId = generateNextClientProfileId;
const generateNextAdminProfileId = () => {
    return new Promise((resolve, reject) => {
        config_1.connection.query("SELECT MAX(profile_id) AS max_profile_id FROM admin_info", (error, results, fields) => {
            if (error) {
                console.error("Error generating next admin profile ID:", error);
                reject(error);
            }
            else {
                const maxProfileId = results[0].max_profile_id;
                const nextProfileId = maxProfileId
                    ? parseInt(maxProfileId.replace("BP24A", "")) + 1
                    : 1;
                const generatedId = `BP24A${nextProfileId
                    .toString()
                    .padStart(4, "0")}`;
                resolve(generatedId);
            }
        });
    });
};
exports.generateNextAdminProfileId = generateNextAdminProfileId;
const generateNextEmployeeProfileId = () => {
    return new Promise((resolve, reject) => {
        config_1.connection.query("SELECT MAX(profile_id) AS max_profile_id FROM employee_info", (error, results, fields) => {
            if (error) {
                console.error("Error generating next admin profile ID:", error);
                reject(error);
            }
            else {
                const maxProfileId = results[0].max_profile_id;
                const currentDate = new Date();
                const month = (currentDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                const year = currentDate.getFullYear().toString().slice(-2);
                const serialNumber = parseInt(maxProfileId.slice(-4));
                const nextSerialNumber = serialNumber + 1;
                const generatedId = `BP${month}${year}F${nextSerialNumber
                    .toString()
                    .padStart(4, "0")}`;
                resolve(generatedId);
            }
        });
    });
};
exports.generateNextEmployeeProfileId = generateNextEmployeeProfileId;
