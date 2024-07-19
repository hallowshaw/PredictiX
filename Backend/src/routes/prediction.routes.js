import { Router } from "express";
import {
  heartpred,
  diabetespred,
  lungpred,
  upload,
  breastpred,
} from "../controllers/pred.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/heart-pred").post(verifyJWT, heartpred);
router.route("/diabetes-pred").post(verifyJWT, diabetespred);
router.route("/lung-pred").post(verifyJWT, upload.single("image"), lungpred);
router
  .route("/breast-pred")
  .post(verifyJWT, upload.single("image"), breastpred);

export default router;
