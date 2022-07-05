import express from "express";
import { registerPost } from "../controllers/registerController.js";
import checkValidation from "../validators/checkValidation.js";
import registerValidator from "../validators/registerValidator.js";
import requiredValues from "../validators/requiredValues.js";

const router = express.Router();

/*
req.body = {
    username: "JamieC",
    password: "abc123",
    emailAddress: "test@test.test"
}
*/

//         path  validation middleware                                                                          controller function
router.post("/", requiredValues(["username", "password", "emailAddress"]), registerValidator(), checkValidation, registerPost);    // POST /register

export default router;