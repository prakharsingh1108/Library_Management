import express from 'express';
import { addBook, getAllBooks, deleteBook } from '../controllers/bookController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/all", getAllBooks);
router.post("/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

export default router;
