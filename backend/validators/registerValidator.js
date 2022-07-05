import { check } from "express-validator";

const registerValidator = () => {
    return [
        // Array item 1
        // Make sure the username is between 6 characters and 15 characters in length
        check("username")
            // escape = sanitize data from frontend to "clean up" any HTML-like syntax
            .trim().isLength({ min: 6, max: 50 })
            .withMessage("Username must be between 6 and 15 characters")
            // Custom validator - we choose what we want to check
            // If we return false from the logic, there is an error
            .custom(value => {
                // Do not let the user register if their username contains the string "jamie"
                // Return true if the username does not contain the string "jamie"
                // Return false if the username does contain the string "jamie"
                return value.toLowerCase().indexOf("jamie") === -1;
            })
            .withMessage("No Jamies allowed!"),

            // indexOf("jamie") = 6
            // abcd-1jami3

            // indexOf("jamie") = -1
            // abcd-1jami

        // Array item 2
        check("password")
            .escape().trim().isStrongPassword()
            .withMessage("Password must be minimum 8 characters and contain at least one lowercase letter, uppercase letter, number and symbol"),
        // Array item 3
        check("emailAddress")
            .normalizeEmail().isEmail()
            .withMessage("Email address should be in a valid format")
    ]
}

export default registerValidator;