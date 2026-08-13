import db from './db.js';

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
SELECT
    project_id,
    organization_id,
    title,
    description,
    location,
    project_date
FROM service_project
WHERE organization_id = $1
ORDER BY project_date;
`;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
    SELECT
      service_project.project_id,
      service_project.title,
      service_project.description,
      service_project.project_date,
      service_project.location,
      service_project.organization_id,
      organization.name AS organization_name
    FROM service_project
    JOIN organization
      ON service_project.organization_id = organization.organization_id
    WHERE service_project.project_date >= CURRENT_DATE
    ORDER BY service_project.project_date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [numberOfProjects]);
  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT
      service_project.project_id,
      service_project.title,
      service_project.description,
      service_project.project_date,
      service_project.location,
      service_project.organization_id,
      organization.name AS organization_name
    FROM service_project
    JOIN organization
      ON service_project.organization_id = organization.organization_id
    WHERE service_project.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO service_project (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
}

const updateProject = async (
  projectId,
  title,
  description,
  location,
  projectDate,
  organizationId
) => {
  const query = `
    UPDATE service_project
    SET
      title = $1,
      description = $2,
      location = $3,
      project_date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [
    title,
    description,
    location,
    projectDate,
    organizationId,
    projectId
  ];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', projectId);
  }

  return result.rows[0].project_id;
};

const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO project_volunteer (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id)
    DO NOTHING
    RETURNING user_id, project_id;
  `;

  const result = await db.query(query, [userId, projectId]);

  return result.rows[0];
};


const removeVolunteer = async (userId, projectId) => {
  const query = `
    DELETE FROM project_volunteer
    WHERE user_id = $1
      AND project_id = $2;
  `;

  const result = await db.query(query, [userId, projectId]);

  return result.rowCount;
};


const getProjectsByUserId = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM project_volunteer pv
    JOIN service_project p
      ON pv.project_id = p.project_id
    JOIN organization o
      ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.project_date ASC;
  `;

  const result = await db.query(query, [userId]);

  return result.rows;
};


const isUserVolunteer = async (userId, projectId) => {
  const query = `
    SELECT 1
    FROM project_volunteer
    WHERE user_id = $1
      AND project_id = $2;
  `;

  const result = await db.query(query, [userId, projectId]);

  return result.rowCount > 0;
};

// Export the model functions
export {
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails, createProject, updateProject,
  addVolunteer,
  removeVolunteer,
  getProjectsByUserId,
  isUserVolunteer
};