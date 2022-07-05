import { check } from "express-validator";

// For now, this will check if any of the fields were left blank when the user tried to register
// When the user sends a request to register, this middleware will be called first, before the controller function.

// #region First version

// ! First version - without "express-validator"

// Wrapper function, which can access the array passed as an argument in the router
// E.g. for the POST / register route, props = ["username", "password", "emailAddress"]
// const requiredValues = (props) => {
//     return (req, res, next) => {
//         // Loop through each of the properties of the req.body
//         // If any of them do not have a value (i.e. the user did not fill in that input)...
//         // Send an error object to the error handling middleware - DO NOT go to the controller function!
//         props.forEach(field => {
//             if (!req.body[field]) return next(createError(401, `${field} is required`));
//         })

//         // Only if all properties of req.body "make it through" the forEach loop...
//         // ... then go to the controller function to interact with your database. :-)
//         next();
//     }
// }

//#endregion

// * Second version - with "express-validator"
const requiredValues = (props) => {
    let checks = [];

    // Array passed when calling the function in a route (e.g. [ "username", "password", "emailAddress" ])
    // Create a check for each value in the array
    props.forEach(field => {
        checks.push(
            check(field)
            .notEmpty()
            .withMessage(`${field} is required`),
        )
    })

    return checks;
}

export default requiredValues;