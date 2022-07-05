import createError from "http-errors";
import User from "../models/user.js";

export const countUsers = async (req, res, next) => {
    // To count all documents in a collection we can use the Mongoose method countDocuments() 
    let numOfDocuments;

    try {
        numOfDocuments = await User.countDocuments({});
    } catch {
        return next(createError(500, "Database could not be queried. Please try again"));
    }

    res.json({ count: numOfDocuments });
}