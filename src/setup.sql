-- Organization Table
CREATE TABLE
  organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
  );

-- Insert Sample Data
INSERT INTO
  organization (name, description, contact_email, logo_filename)
VALUES
  (
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
  ),
  (
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
  ),
  (
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
  );

SELECT
  *
FROM
  organization;

-- Service Project Table
CREATE TABLE
  service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
  );

SELECT
  *
FROM
  service_project;

-- Service Projects
INSERT INTO
  service_project (
    organization_id,
    title,
    description,
    location,
    project_date
  )
VALUES
  -- BrightFuture Builders (Organization 1)
  (
    1,
    'Neighborhood Playground Renovation',
    'Renovate a community playground using sustainable materials.',
    'Quezon City',
    '2026-08-10'
  ),
  (
    1,
    'Community Housing Repair',
    'Repair homes for low-income families.',
    'Marikina',
    '2026-08-17'
  ),
  (
    1,
    'Bridge Cleanup',
    'Clean and repaint a pedestrian bridge.',
    'Pasig',
    '2026-08-24'
  ),
  (
    1,
    'School Fence Restoration',
    'Restore damaged school fencing.',
    'Manila',
    '2026-09-01'
  ),
  (
    1,
    'Senior Center Maintenance',
    'Improve facilities for senior citizens.',
    'San Juan',
    '2026-09-15'
  ),
  -- GreenHarvest Growers (Organization 2)
  (
    2,
    'Urban Garden Workshop',
    'Teach residents how to grow vegetables at home.',
    'Quezon City',
    '2026-08-05'
  ),
  (
    2,
    'Community Vegetable Garden',
    'Build a vegetable garden for the community.',
    'Pasig',
    '2026-08-20'
  ),
  (
    2,
    'Tree Planting Drive',
    'Plant native trees in public areas.',
    'Antipolo',
    '2026-09-10'
  ),
  (
    2,
    'Composting Seminar',
    'Teach composting techniques for households.',
    'Makati',
    '2026-09-20'
  ),
  (
    2,
    'Seed Distribution',
    'Provide free vegetable seeds to residents.',
    'Taguig',
    '2026-10-02'
  ),
  -- UnityServe Volunteers (Organization 3)
  (
    3,
    'Food Packing Event',
    'Prepare food packages for families in need.',
    'Quezon City',
    '2026-08-12'
  ),
  (
    3,
    'Community Tutoring',
    'Volunteer tutoring sessions for students.',
    'Caloocan',
    '2026-08-19'
  ),
  (
    3,
    'Blood Donation Drive',
    'Organize a community blood donation event.',
    'Manila',
    '2026-09-03'
  ),
  (
    3,
    'Relief Goods Distribution',
    'Distribute relief goods to affected families.',
    'Bulacan',
    '2026-09-18'
  ),
  (
    3,
    'Charity Fun Run',
    'Fundraising fun run for community programs.',
    'Pasay',
    '2026-10-05'
  );

SELECT
  *
FROM
  service_project;

-- Service Category Table
CREATE TABLE
  service_category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );

-- Project Category Table
CREATE TABLE
  project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project (project_id),
    FOREIGN KEY (category_id) REFERENCES service_category (category_id)
  );

INSERT INTO
  service_category (name)
VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service');

SELECT
  *
FROM
  service_category;

INSERT INTO
  project_category (project_id, category_id)
VALUES
  (1, 3),
  (2, 3),
  (3, 3),
  (4, 2),
  (5, 3),
  (6, 2),
  (7, 1),
  (8, 1),
  (9, 2),
  (10, 1),
  (11, 3),
  (12, 2),
  (13, 3),
  (14, 3),
  (15, 3);

SELECT
  *
FROM
  project_category;