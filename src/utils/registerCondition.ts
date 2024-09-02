import httpStatus from "http-status";
import { connection } from "../app/config";

const checkClientDataByEmail = (email: string, req: any, res: any) => {
  connection.query(
    "SELECT * FROM client_data WHERE email = ?",
    [email],
    async (error: any, clientResults: any, fields: any) => {
      if (error) {
        console.error("Error querying client data:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
          errorMessages: [
            {
              path: req.originalUrl,
              message: "Error querying client data",
            },
          ],
        });
      }

      if (clientResults.length > 0) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email already exists in client data",
          errorMessages: [
            {
              path: req.originalUrl,
              message: "Email already exists in client data",
            },
          ],
        });
      }
    }
  );
};

const checkAdminInfoByEmail = (email: string, req: any, res: any) => {
  connection.query(
    "SELECT * FROM admin_info WHERE admin_email = ?",
    [email],
    async (error: any, adminResults: any, fields: any) => {
      if (error) {
        console.error("Error querying admin info:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
          errorMessages: [
            {
              path: req.originalUrl,
              message: "Error querying admin info",
            },
          ],
        });
      }

      if (adminResults.length > 0) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email already exists in admin info",
          errorMessages: [
            {
              path: req.originalUrl,
              message: "Email already exists in admin info",
            },
          ],
        });
      }
    }
  );
};

const getEmployeeByEmail = (email: string, req: any, res: any) => {
  connection.query(
    "SELECT * FROM employee_info WHERE emp_email = ?",
    [email],
    async (error: any, employeeResults: any, fields: any) => {
      if (error) {
        console.error("Error querying employee info:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal Server Error",
          errorMessages: [
            {
              path: req.originalUrl,
              message: "Error querying employee info",
            },
          ],
        });
      }

      if (employeeResults.length > 0) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email already exists in employee info",
          errorMessages: [
            {
              path: req.originalUrl,
              message: "Email already exists in employee info",
            },
          ],
        });
      }
    }
  );
};

export { checkClientDataByEmail, checkAdminInfoByEmail, getEmployeeByEmail };
