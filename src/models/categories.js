import db from './db.js';

const getAllCategories = async () => {

  const query = `
        SELECT
            category_id,
            name
        FROM service_category
        ORDER BY name;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryDetails = async (categoryId) => {
  const query = `
  SELECT
    category_id,
    name
  FROM service_category
  WHERE category_id = $1;
`;

  const result = await db.query(query, [categoryId]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      service_category.category_id,
      service_category.name
    FROM service_category
    JOIN project_category
      ON service_category.category_id = project_category.category_id
    WHERE project_category.project_id = $1
    ORDER BY service_category.name;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      service_project.project_id,
      service_project.title
    FROM service_project
    JOIN project_category
      ON service_project.project_id = project_category.project_id
    WHERE project_category.category_id = $1
    ORDER BY service_project.project_date;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows;
};

export {
  getAllCategories,
  getCategoryDetails,
  getCategoriesByProjectId,
  getProjectsByCategoryId
};