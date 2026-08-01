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

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
      INSERT INTO project_category (category_id, project_id)
      VALUES ($1, $2);
  `;

  await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
      DELETE FROM project_category
      WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
}

const createCategory = async (name) => {
  const query = `
    INSERT INTO service_category (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const result = await db.query(query, [name]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create category');
  }

  return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE service_category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const result = await db.query(query, [name, categoryId]);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  return result.rows[0].category_id;
};

export {
  getAllCategories,
  getCategoryDetails,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  assignCategoryToProject,
  updateCategoryAssignments,
  createCategory,
  updateCategory
};