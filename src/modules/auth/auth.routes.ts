import express from "express"
import { registerUser,loginUser } from "./auth.controller.js"
import { validate } from "../../middlewares/validate.middleware.js";
import { registerSchema } from "../../validation/auth.validation.js";


export const router= express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login',loginUser);