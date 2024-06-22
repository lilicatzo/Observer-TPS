const express = require('express');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

router.post('/submit-complaint', complaintController.isLoggedIn, complaintController.upload.single('media'), complaintController.submitComplaint);
router.get('/see-complaints', complaintController.seeComplaints);  

module.exports = router;
