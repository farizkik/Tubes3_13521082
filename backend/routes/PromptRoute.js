import express from "express";
import {
    getPrompts, 
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt
} from "../controllers/PromptController.js";

const router = express.Router();

router.get('/prompts', getPrompts);
router.get('/prompts/:id', getPromptById);
router.post('/prompts', createPrompt);
router.patch('/prompts/:id',updatePrompt);
router.delete('/prompts/:id',deletePrompt);

export default router;