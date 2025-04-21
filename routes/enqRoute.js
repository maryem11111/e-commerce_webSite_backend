const express = require('express');
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getallEnquiry } = require('../controllers/enqController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createEnquiry);
router.get('/',getallEnquiry);


router.put('/:id',authMiddleware,isAdmin,updateEnquiry);
router.delete('/:id',authMiddleware,isAdmin,deleteEnquiry);
router.get('/:id', getEnquiry);
module.exports = router;