const express = require('express');
const { createColor, updateColor, deleteColor, getColor, getallColor } = require('../controllers/colorController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createColor);
router.get('/',getallColor);


router.put('/:id',authMiddleware,isAdmin,updateColor);
router.delete('/:id',authMiddleware,isAdmin,deleteColor);
router.get('/:id', getColor);
module.exports = router;