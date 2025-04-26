-- 1) Identify any duplicates (resolve these before enforcing uniqueness)
WITH duplicates AS (
  SELECT role_name,
         COUNT(*) AS cnt
  FROM user_management.roles
  GROUP BY role_name
  HAVING COUNT(*) > 1
)
SELECT * FROM duplicates;

-- 2) Drop the constraint if it already exists (avoids errors on reruns)
ALTER TABLE user_management.roles
  DROP CONSTRAINT IF EXISTS uq_roles_name;

-- 3) Add the UNIQUE constraint on role_name
ALTER TABLE user_management.roles
  ADD CONSTRAINT uq_roles_name UNIQUE (role_name);
