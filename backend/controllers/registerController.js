import createError from "http-errors";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const registerPost = async (req, res, next) => {
    const { username, password, firstName, lastName, emailAddress } = req.body;

    // Step 1: Make sure the username has not already been taken
    let foundUsername;

    try {
        foundUsername = await User.findOne({ username: username });
    } catch {
        return next(createError(500, "Database could not be queried. Please try again"));
    }

    if (foundUsername) {
        return next(createError(409, "Username has already been taken. Please try a different username"));
    }

    // Step 2: Make sure the email address has not already been taken
    let foundEmail;

    try {
        foundEmail = await User.findOne({ emailAddress: emailAddress });
    } catch {
        return next(createError(500, "Database could not be queried. Please try again"));
    }

    if (foundEmail) {
        return next(createError(412, "Email address has already been used to create an account. Please try a different email address"));
    }

    const newUser = new User({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        isAdmin: false,
        albums: []
    });

    try {
        await newUser.save();   // We could get a validation error here if the schema is not fulfilled
    } catch {
        return next(createError(500, "User could not be created. Please try again"));
    }

    // * Create and issue a JSON web token
    let newToken;

    try {
        // Create a token to give to the new user using jwt.sign().
        // 3 x arguments:
        //  - 1. Data to encode ("payload") - in our case, the user's id
        //  - 2. Private key - only known by the server - NEVER share this with anyone!
        //  - 3. Optional - configuration (e.g. when the token should expire)

        //                   1                  2                       3           "1 hour"
        newToken = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, { expiresIn: "1h" } )
    
        // Add a cookie containing the token to the response object
        res.cookie("dataCookie", newToken, { httpOnly: true, sameSite: "Strict" });
    } catch {
        return next(createError(500, "Signup could not be completed. Please try again"));
    }

    // Send a response to the client containing the new user object in a JSON format
    res.status(201).json({ id: newUser._id, token: newToken });
}