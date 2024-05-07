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
  `advisor` longblob,
  `ta_instructor` longblob,
  `remarks` varchar(200) DEFAULT NULL,
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
    withdraw_reason VARCHAR(255) DEFAULT NULL -- Removed the comma at the end
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    run_date DATETIME NOT NULL
);
