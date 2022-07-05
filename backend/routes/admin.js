import express from "express";
import { countUsers } from "../controllers/adminController.js";
import isAdmin from "../middleware/checkIsAdmin.js";

const router = express.Router();

// Authorization middleware - did the request come from an admin?
router.use(isAdmin);

router.get("/:id/count", countUsers)    // GET /admin/1234/count

export default router;