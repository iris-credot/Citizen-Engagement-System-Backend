const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authentication');
const categoryController = require('../Controllers/CategoryController');

router.post('/create',auth.superAdminJWT, categoryController.createCategory);
router.get('/getall', auth.AuthJWT,categoryController.getAllCategories);
router.get('/filter',auth.AuthJWT, categoryController.filterCategoriesByAgency);
router.get('/getOne/:id',auth.AuthJWT, categoryController.getCategoryById);
router.put('/update/:id',auth.superAdminJWT, categoryController.updateCategory);
router.delete('/delete/:id', auth.superAdminJWT,categoryController.deleteCategory);

module.exports = router;
