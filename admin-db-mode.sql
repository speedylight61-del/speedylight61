-- alter the admin table 
ALTER TABLE admin_pass_hash 
ADD COLUMN USERNAME VARCHAR(255) NOT NULL UNIQUE AFTER id,
ADD COLUMN EMAIL VARCHAR(255) NOT NULL UNIQUE AFTER USERNAME,
ADD COLUMN USER_ROLE ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin' AFTER PASSWORD_HASH; 



-- this is the default administrator account
INSERT INTO admin_pass_hash (USERNAME, EMAIL, PASS_HASH, USER_ROLE)
VALUES ('admin', 'admin@example.com', '$2b$10$0VXq2mDRTlQt22jyxcKw0u/qKYM8nGWixOk505inPrcVvSpVaGrZq', 'superadmin');

-- this must be in the env file (IMPORTANT: keep it secret and safe)
JWT_SECRET_KEY=685df7dcd506aa97482f50f9fb76b7d92fa168bf65aa6484b105657c6e6f88a0f2119880


-- ADMIN USERNAME AND PASSWORD ADD
USERNAME : admin 
PASSWORD : Oh1o4o58vUjp