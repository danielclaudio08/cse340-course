// Import any needed model functions
import { getAllCategories } from '../models/categories.js';

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

// Export any controller functions
export { showCategoriesPage };