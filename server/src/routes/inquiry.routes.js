import express from 'express';
import { createInquiry, getInquiries, updateInquiryStatus } from '../controller/inquiry.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createInquiry)
  .get(protect, admin, getInquiries);

router.route('/:id/status')
  .put(protect, admin, updateInquiryStatus);

export default router;
