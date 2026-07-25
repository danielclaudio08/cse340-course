// Import any needed model functions (none are needed for the home page, so this is empty)

// Define any controller functions
const showHomePage = async (req, res) => {
  const title = 'Home Page';

  res.render('home', {
    title,
    currentPage: 'home'
  });
};

// Export any controller functions
export { showHomePage };