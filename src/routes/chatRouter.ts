import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation";
import createChat from "../controllers/chat/createChat";
import fetchChats from "../controllers/chat/fetchChats";
import fetchData from "../controllers/chat/fetchData";
import searchChat from "../controllers/chat/searchChat";
import joinChat from "../controllers/chat/joinChat";

const router = Router();

router.get('/', tokenValidation, fetchChats);
router.get('/get/:id', tokenValidation, fetchData);
router.get('/search', tokenValidation, searchChat);
router.post('/create', tokenValidation, createChat);
router.post('/join', tokenValidation, joinChat);


export default router;