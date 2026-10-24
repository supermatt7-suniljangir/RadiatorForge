import { RequestHandler, Router } from "express";
import LikesController from "../controllers/like.controller";
import { auth, optionalAuth } from "../middlewares/auth";
import { limiters } from "../utils/rateLimiters";

const router = Router();
router.put(
  "/:projectId/toggle",
  limiters.dev,
  auth,
  LikesController.toggleLikeProject,
);
router.get("/:projectId", limiters.dev, LikesController.fetchProjectLikes);
router.get(
  "/:projectId/check",
  limiters.dev,
  auth,
  LikesController.hasUserLikedProject,
);
router.get(
  "/:userId/user",
  limiters.dev,
  auth,
  LikesController.fetchProjectsLikedByUser,
);

export default router;
