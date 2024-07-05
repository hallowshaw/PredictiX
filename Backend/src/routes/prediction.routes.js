import { Router } from "express";
import {
  heartpred,
  diabetespred,
  lungpred,
  breastpred,
} from "../controllers/pred.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//secured routes
router.route("/heart-pred").post(verifyJWT, heartpred);
router.route("/diabetes-pred").post(verifyJWT, diabetespred);
router.route("/lung-pred").post(verifyJWT, lungpred);
router.route("/breast-pred").post(verifyJWT, breastpred);

export default router;
