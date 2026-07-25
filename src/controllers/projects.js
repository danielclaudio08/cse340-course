// Import any needed model functions
import {
  getUpcomingProjects,
  getProjectDetails
} from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

  res.render('projects', {
    title: 'Upcoming Service Projects',
    currentPage: 'projects',
    projects
  });
};

const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }

    res.render('project', {
      title: project.title,
      currentPage: 'projects',
      project
    });

  } catch (err) {
    next(err);
  }
};

// Export any controller functions
export {
  showProjectsPage,
  showProjectDetailsPage
};