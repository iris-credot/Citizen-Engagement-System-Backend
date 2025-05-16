const Category = require('../Models/CategoryModel');
const Agency = require('../Models/AgencyModel'); // Assuming you have this model
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./NotificationController'); // Optional

const categoryController = {
  // Create new category
  createCategory: asyncWrapper(async (req, res, next) => {
    const { name, description, agency_id } = req.body;

    if (!name || !agency_id) {
      return next(new BadRequest('Category name and agency ID are required.'));
    }

    // Validate agency exists
    const agency = await Agency.findById(agency_id);
    if (!agency) {
      return next(new NotFound(`No agency found with ID ${agency_id}`));
    }

    // Prevent duplicate category name under the same agency
    const existingCategory = await Category.findOne({ name: name.trim(), agency_id });
    if (existingCategory) {
      return next(new BadRequest(`Category "${name}" already exists for this agency.`));
    }

    const category = new Category({
      name: name.trim(),
      description: description || '',
      agency_id
    });

    const savedCategory = await category.save();

    // Optional: notify agency about new category creation
    await sendNotification({
      users: agency_id,
      message: `New category "${name}" has been created.`,
      type: 'category'
    });

    res.status(201).json({ message: 'Category created successfully', category: savedCategory });
  }),

  // Get all categories
  getAllCategories: asyncWrapper(async (req, res) => {
    const categories = await Category.find().populate('agency_id');
    res.status(200).json({ categories });
  }),

  // Get category by ID
  getCategoryById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate('agency_id');

    if (!category) {
      return next(new NotFound(`No category found with ID ${id}`));
    }

    res.status(200).json({ category });
  }),

  // Update a category
  updateCategory: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) updates.name = updates.name.trim();

    // Optionally validate agency_id if updated
    if (updates.agency_id) {
      const agency = await Agency.findById(updates.agency_id);
      if (!agency) {
        return next(new NotFound(`No agency found with ID ${updates.agency_id}`));
      }
    }

    // Prevent duplicate name in same agency if name or agency_id changed
    if (updates.name || updates.agency_id) {
      const category = await Category.findById(id);
      if (!category) {
        return next(new NotFound(`No category found with ID ${id}`));
      }
      const agencyToCheck = updates.agency_id || category.agency_id;
      const nameToCheck = updates.name || category.name;

      const duplicate = await Category.findOne({
        _id: { $ne: id },
        name: nameToCheck,
        agency_id: agencyToCheck
      });

      if (duplicate) {
        return next(new BadRequest(`Category "${nameToCheck}" already exists for this agency.`));
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('agency_id');

    if (!updatedCategory) {
      return next(new NotFound(`No category found with ID ${id}`));
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  }),

  // Delete a category
  deleteCategory: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return next(new NotFound(`No category found with ID ${id}`));
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  }),

  // Filter categories by agency_id
  filterCategoriesByAgency: asyncWrapper(async (req, res, next) => {
    const { agency_id } = req.query;

    if (!agency_id) {
      return next(new BadRequest('agency_id query parameter is required'));
    }

    const categories = await Category.find({ agency_id }).populate('agency_id');

    if (!categories.length) {
      return next(new NotFound(`No categories found for agency ID ${agency_id}`));
    }

    res.status(200).json({ categories });
  })
};

module.exports = categoryController;
