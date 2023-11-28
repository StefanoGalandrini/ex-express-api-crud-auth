const { Router } = require('express');
const router = Router();
const categoriesController = require('../controllers/categoriesController');

router.get('/', categoriesController.index);

router.post('/', categoriesController.store);

module.exports = router;
