import { Router } from "express";
import login from "../controllers/user/login";
import registerValidation from "../middlewares/registerValidation";
import signup from "../controllers/user/signup";
import tokenValidation from "../middlewares/tokenValidation";
import fetchDetails from "../controllers/user/fetchDetails";

const router = Router();

//logout
router.post("/logout", (_, res) => {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).end();
});

router.post('/login', login);
router.post('/signup', registerValidation, signup);
router.get('/', tokenValidation, fetchDetails);

export default router;