import express from "express";
import { albumsPost } from "../controllers/albumsController.js";
import checkValidation from "../validators/checkValidation.js";
import requiredValues from "../validators/requiredValues.js";
import albumValidator from "../validators/albumValidator.js";
import authorizeUser from "../middleware/authorizeUser.js";

const router = express.Router();

// * Authorization middleware
// Check the user has given a valid token as part of the request they sent
// If the token is valid, continue...
// If not, send back a 403 error response to the frontend --> "Not authorized"
router.use(authorizeUser);

router.post("/", requiredValues(["albumTitle", "band", "albumYear"]), albumValidator(), checkValidation, albumsPost);    // POST /albums

export default router;