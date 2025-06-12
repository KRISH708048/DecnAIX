import express from 'express';
import authController from "../controller/auth.js";

const router = express.Router();
const {signUpFunction, loginFunction} = authController;

router.post('/sign-up', signUpFunction);
router.post('/login', loginFunction);


export default router;

