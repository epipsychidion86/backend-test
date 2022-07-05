import createError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";


export const loginPost = async (req, res, next) => {
    // Take the username and password the user tried to log in with
    const { username, password } = req.body;

    // Search inside the "users" collection of the "albums-project" db
    // Do any documents have the SAME username AND password?
    let found;

    try {
        found = await User.findOne({ username: username });
    } catch {
        return next(createError(500, "Database couldn't be queried. Please try again"));
    }

    // If we found a user in our db with the same login details as we received from the frontend...
    // Send that user's id back the frontend in the response for further processing
    if (found) {

        let isValidPassword;

        try {
            // Compare plain text password from frontend with hashed password in database
            // If the hash is the same as the plain text password, isValidPassword = true
            // If the hash is not the same, isValidPassword = false
            isValidPassword = await bcrypt.compare(password, found.password);
        } catch {
            return next(createError(500, "Logging in process failed. Please try again"));
        }

        if (!isValidPassword) {
            return next(createError(401, "Incorrect password. Please try again"));
        }

        // * Task 25 - generate a JWT and include it in the response
        let newToken;

        try {
            // Create a token to give to the new user using jwt.sign().
            // 3 x arguments:
            //  - 1. Data to encode ("payload") - in our case, the user's id
            //  - 2. Private key - only known by the server - NEVER share this with anyone!
            //  - 3. Optional - configuration (e.g. when the token should expire)

            //                   1                  2                       3           "1 hour"
            newToken = jwt.sign({ id: found.id }, process.env.SECRET_KEY, { expiresIn: "1h" })

            // * Task 30 - Extra - now store the token in a cookie, to be sent back to the frontend
            
            // Add a new cookie to the response
            // 1 = key, 2 = value, 3 = options
            //        1             2        3
            res.cookie("dataCookie", newToken, { httpOnly: true, sameSite: "Strict" } )

            // Extra cookie options:
            // {sameSite: "Strict"} - cookies only sent in a first-party context, not sent with third-party requests
            // {...httpOnly: true} - prevents client-side JavaScript accessing cookies - safer + more secure
            // ? Other security options:
            // {... secure: true...} - only use the cookie on https-protocol domains
            // {... maxAge: 1000...} - cookie will be deleted after this number of milliseconds.
            //                       - remember: the cookie will persist in the browser until then, even if you end the current session!

        } catch {
            return next(createError(500, "Signup could not be completed. Please try again"));
        }

        res.json({ id: found._id, token: newToken });
        // If we found no user in our db with the same login details as we received from the frontend
        // (E.g. the person logging in made a mistake with their username/password/both!)
        // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
    } else {
        next(createError(404, "No user exists with this username. Please try again"));
    }
}