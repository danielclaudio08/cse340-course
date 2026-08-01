// Import any needed model functions
import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

import { body, validationResult } from 'express-validator';

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Service Projects Categories';

  res.render('categories', {
    title,
    currentPage: 'categories',
    categories
  });
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
      title: category.name,
      currentPage: 'categories',
      category,
      projects
    });

  } catch (err) {
    next(err);
  }
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = 'Assign Categories to Project';

  res.render('assign-categories', {
    title,
    currentPage: 'categories',
    projectId,
    projectDetails,
    categories,
    assignedCategories
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash('success', 'Categories updated successfully.');
  res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {

  const title = 'Add New Category';

  res.render('new-category', {
    title,
    currentPage: 'categories'
  });

};

const processNewCategoryForm = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });

    return res.redirect('/new-category');

  }

  const { name } = req.body;

  const categoryId = await createCategory(name);

  req.flash('success', 'Category added successfully!');

  res.redirect(`/category/${categoryId}`);

};

const showEditCategoryForm = async (req, res) => {

  const categoryId = req.params.id;

  const category = await getCategoryDetails(categoryId);

  const title = 'Edit Category';

  res.render('edit-category', {
    title,
    currentPage: 'categories',
    category
  });

};

const processEditCategoryForm = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });

    return res.redirect(`/edit-category/${req.params.id}`);

  }

  const { name } = req.body;

  await updateCategory(req.params.id, name);

  req.flash('success', 'Category updated successfully!');

  res.redirect(`/category/${req.params.id}`);

};

// Export any controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
};