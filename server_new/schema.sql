CREATE TABLE users (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email_id VARCHAR(255) UNIQUE,
    position VARCHAR(255),
    department VARCHAR(255),
    mobile VARCHAR(20),
    signature LONGBLOB,
    entry_number VARCHAR(20),
    ta_instructor VARCHAR(255),
    advisor VARCHAR(255),
    temporary_role VARCHAR(50)
);

CREATE TABLE `pg_leaves` (
  `leave_id` varchar(20) NOT NULL,
  `department` varchar(10) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `nature` varchar(50) DEFAULT NULL,
  `purpose` varchar(200) DEFAULT NULL,
  `is_station` varchar(10) DEFAULT NULL,
  `request_date` timestamp NULL DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `level` varchar(30) DEFAULT NULL,
  `withdraw_reason` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `signature` longblob,
  `address` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,  
  `duty_start_date` timestamp NULL DEFAULT NULL,
  `duty_end_date` timestamp NULL DEFAULT NULL,
  `prefix_suffix` varchar(255) DEFAULT NULL,
  `station_start_date` timestamp NULL DEFAULT NULL,
  `station_end_date` timestamp NULL DEFAULT NULL,
  `advisor` varchar(255) DEFAULT NULL,
  `ta_instructor` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `int_status` varchar(255) DEFAULT NULL,
  `ta_sig` longblob,
  `advisor_sig` longblob,
  PRIMARY KEY (`leave_id`),
  KEY `leaves_ibfk_3` (`user_id`),
  CONSTRAINT `leaves_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
)

CREATE TABLE leaves (
    leave_id SERIAL PRIMARY KEY,
    department VARCHAR(255),
    user_id INTEGER REFERENCES users(user_id),
    nature VARCHAR(255),
    purpose TEXT,
    is_station BOOLEAN,
    request_date DATE,
    start_date DATE,
    end_date DATE,
    duration INTEGER,
    status VARCHAR(50),
    level VARCHAR(50),
    file_uploaded VARCHAR(255),
    type_of_leave VARCHAR(255),
    filename VARCHAR(255),
    file_data longblob, -- Changed from longblob to LONGTEXT
    signature longblob, -- Changed from longblob to LONGTEXT
    hod_sign longblob, -- Changed from longblob to LONGTEXT
    dean_sign longblob, -- Changed from longblob to LONGTEXT
    office_sig longblob, -- Changed from longblob to LONGTEXT
    address TEXT,
    prefix_start_date DATE,
    prefix_end_date DATE,
    suffix_start_date DATE,
    suffix_end_date DATE,
    alt_arrangements TEXT,
    station_start_date DATE,
    station_end_date DATE,
    authority_comment VARCHAR(200) DEFAULT NULL,
    withdraw_reason VARCHAR(255) DEFAULT NULL, -- Removed the comma at the end
    ar_dr_supdt_sig longblob, -- Changed from longblob to LONGTEXT
    registrar_sig longblob,
);


CREATE TABLE leaves_data (
    user_id INT,
    year INT,
    total_casual_leaves INT,
    taken_casual_leaves INT,
    total_non_casual_leave INT,
    taken_non_casual_leave INT,
    total_restricted_leaves INT,
    taken_restricted_leaves INT,
    total_scl_leaves INT,
    taken_scl_leaves INT,
    total_pg_leaves INT,
    taken_pg_leaves INT,
    PRIMARY KEY (user_id, year)
);

CREATE TABLE scheduled_jobs (
    email VARCHAR(255),
    assign_job_id VARCHAR(255),
    revert_job_id VARCHAR(255),
    start_date DATETIME,
    end_date DATETIME
);


