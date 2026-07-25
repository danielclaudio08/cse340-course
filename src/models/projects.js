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

// Export the model functions
export {
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails
};