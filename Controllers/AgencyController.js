const Agency = require('../Models/AgencyModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');

const agencyController = {
  // Create new agency
  createAgency: asyncWrapper(async (req, res, next) => {
    const { name, description, location, contact_email } = req.body;

    if (!name || !contact_email) {
      return next(new BadRequest('Name and contact email are required.'));
    }

    const existingAgency = await Agency.findOne({ name: name.trim() });
    if (existingAgency) {
      return next(new BadRequest('Agency with this name already exists.'));
    }

    const agency = new Agency({
      name,
      description,
      location,
      contact_email,
    });

    const savedAgency = await agency.save();
    res.status(201).json({ message: 'Agency created successfully', agency: savedAgency });
  }),

  // Get all agencies
  getAllAgencies: asyncWrapper(async (req, res) => {
    const agencies = await Agency.find().sort({ createdAt: -1 });
    res.status(200).json({ agencies });
  }),

  // Get single agency by ID
  getAgencyById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const agency = await Agency.findById(id);

    if (!agency) {
      return next(new NotFound(`No agency found with ID ${id}`));
    }

    res.status(200).json({ agency });
  }),

  // Update agency by ID
  updateAgency: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedAgency = await Agency.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAgency) {
      return next(new NotFound(`No agency found with ID ${id}`));
    }

    res.status(200).json({ message: 'Agency updated successfully', agency: updatedAgency });
  }),

  // Delete agency
  deleteAgency: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedAgency = await Agency.findByIdAndDelete(id);

    if (!deletedAgency) {
      return next(new NotFound(`No agency found with ID ${id}`));
    }

    res.status(200).json({ message: 'Agency deleted successfully' });
  }),

  // Filter agencies by name or location
  filterAgencies: asyncWrapper(async (req, res) => {
    const { name, location } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };

    const agencies = await Agency.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ agencies });
  }),

  // Get agency by email
  getAgencyByEmail: asyncWrapper(async (req, res, next) => {
    const { email } = req.query;

    if (!email) {
      return next(new BadRequest('Email query parameter is required.'));
    }

    const agency = await Agency.findOne({ contact_email: email.toLowerCase().trim() });

    if (!agency) {
      return next(new NotFound(`No agency found with email ${email}`));
    }

    res.status(200).json({ agency });
  }),
};

module.exports = agencyController;
