import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation";
import createChat from "../controllers/chat/createChat";
import fetchChats from "../controllers/chat/fetchChats";
import fetchData from "../controllers/chat/fetchData";

const router = Router();

router.get('/', tokenValidation, fetchChats);
router.get('/:id', tokenValidation, fetchData);
router.post('/create', tokenValidation, createChat);


export default router;