const { Router } = require('express');
const router = Router();
const tagsController = require('../controllers/tagsController');

router.post('/', tagsController.store);

module.exports = router;
