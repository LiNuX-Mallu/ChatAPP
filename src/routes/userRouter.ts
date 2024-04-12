import { Router } from "express";
import login from "../controllers/user/login";
import registerValidation from "../middlewares/registerValidation";
import signup from "../controllers/user/signup";

const router = Router();

router.post('/login', login);
router.post('/signup', registerValidation, signup);

export default router;