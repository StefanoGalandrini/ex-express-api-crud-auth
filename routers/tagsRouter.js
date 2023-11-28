const { Router } = require('express');
const router = Router();
const tagsController = require('../controllers/tagsController');


router.get('/', tagsController.index);

router.post('/', tagsController.store);

module.exports = router;
