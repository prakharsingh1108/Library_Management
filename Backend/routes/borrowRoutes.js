import express from 'express';
import { recordBorrowBook, returnBorrowBook, borrowedBooks, getBorrowedByAdmin } from '../controllers/borrowController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/borrow", isAuthenticated, recordBorrowBook);
router.put("/return/:id", isAuthenticated, returnBorrowBook);
router.get("/my", isAuthenticated, borrowedBooks);
router.get("/all", isAuthenticated, isAuthorized("Admin"), getBorrowedByAdmin);

export default router;
