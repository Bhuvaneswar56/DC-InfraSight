import { body, param, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

function adminRegisterValidation() {
    return [
        body("username")
            .isAlphanumeric().withMessage("Username must contain only letters and numbers")
            .notEmpty().withMessage("Username is required"),
        body("email")
            .isEmail().withMessage("Invalid Email")
            .notEmpty().withMessage("Email is required"),
        body("password")
            .notEmpty().withMessage("Password is required")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).withMessage("Password must contain at least one letter, one number, and be at least 6 characters long"),
        body("name")
            .isAlpha().withMessage("First name should only contain letters")
            .notEmpty().withMessage("Name is required"),
        body("role")
            .equals('admin').withMessage("Role must be 'admin'")
            .notEmpty().withMessage("Role is required"),
        body("department")
            .optional()  
            .isString().withMessage("Department must be a valid string"),       
    ];
}

function adminLoginValidation() {
    return [
        body("email")
            .isEmail().withMessage("Invalid Email")
            .notEmpty().withMessage("Email is required"),
        body("password")
            .notEmpty().withMessage("Password is required")
    ];
}

function changePasswordValidation() {
    return [
        body("password")
            .notEmpty().withMessage("Password is required"),
        body("newPassword")
            .notEmpty().withMessage("New password is required")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .withMessage("New password must contain at least one letter, one number, and be at least 6 characters long"),
    ]
}

function locationValidation() {
    return [
        body("name")
            .notEmpty().withMessage("Name is required")
            .isString().withMessage("Name must be a string"),
        body("type")
            .notEmpty().withMessage("Type is required")
            .isString().withMessage("Type must be a string"),    
        body("floor")
            .notEmpty().withMessage("Floor is required")
            .isInt({ gt: 0 }).withMessage("Floor must be a positive integer"),  
        body("building")
            .notEmpty().withMessage("Building is required")
            .isString().withMessage("Building must be a string"),
        body("capacity").custom((value) => {
            if (typeof value !== 'object' || value === null) {
                throw new Error("Capacity must be an object with power, cooling, and totalRacks");
            }
            const { power, cooling, totalRacks } = value;
            if (typeof power !== 'number' || power <= 0) {
                throw new Error("Capacity.power must be a positive number");
            }
            if (typeof cooling !== 'number' || cooling <= 0) {
                throw new Error("Capacity.cooling must be a positive number");
            }
            if (typeof totalRacks !== 'number' || totalRacks <= 0) {
                throw new Error("Capacity.totalRacks must be a positive number");
            }
            return true;
        }),
        body("status")
            .notEmpty().withMessage("Status is required")
            .isString().withMessage("Status must be a string"),
        body('createdBy')
            .notEmpty().withMessage('CreatedBy is required.')
            .isMongoId().withMessage('CreatedBy must be a valid MongoDB ObjectId.')
    ]
}
function equipmentValidation() {
    return [
        body("name")
            .notEmpty().withMessage("Name is required")
            .isString().withMessage("Name must be a string"),
        body("serialNumber")
            .notEmpty().withMessage("Serial number is required")
            .isAlphanumeric().withMessage("Serial number must be a string + numeric"),        
        body("type")
            .notEmpty().withMessage("Type is required")
            .isString().withMessage("Type must be a string"),        
        param("locationId")
            .notEmpty().withMessage("Location ID is required")
            .isMongoId().withMessage("Invalid Location ID"),
        body("manufacturer")
            .notEmpty().withMessage("Manufacturer is required")
            .isString().withMessage("Manufacturer must be a string"),
        body("model")
            .optional()
            .isAlphanumeric().withMessage("Model must be a string"),
        body("specifications")
            .optional()
            .isObject().withMessage("Specifications must be an object"),
        body("metrics")
            .optional()
            .isObject().withMessage("Metrics must be an object"),
        body("lastMaintenanceDate")
            .optional()
            .isISO8601().withMessage("Last maintenance date must be a valid ISO date"),
        body("nextMaintenanceDate")
            .optional()
            .isISO8601().withMessage("Next maintenance date must be a valid ISO date"),
    ]
}

function metricsValidation() {
    return [
        param('postId')
            .notEmpty().withMessage("PostId is required")
            .isMongoId().withMessage("Invalid Mongoose Id"),
    ]
}

function handleValidationErrors(req, res, next) {
    const errorsResult = validationResult(req);
    if (errorsResult.isEmpty()) {
        return next();
    }

    throw new ApiError(400, "Validation Error", errorsResult.array())
}



export {
    adminRegisterValidation,
    adminLoginValidation,
    locationValidation,
    metricsValidation,
    equipmentValidation,
    handleValidationErrors,
    changePasswordValidation
};