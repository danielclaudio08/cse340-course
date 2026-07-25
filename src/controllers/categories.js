// Import any needed model functions
import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId
} from '../models/categories.js';

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

// Export any controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage
};