-- Create table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK(gender IN ('M', 'F')),
    height_cm REAL,
    weight_kg REAL,
    major TEXT,
    part_time_job TEXT CHECK(part_time_job IN ('Yes', 'No')),
    commute_time_min REAL
);

-- Insert data
INSERT INTO students (student_id, full_name, age, gender, height_cm, weight_kg, major, part_time_job, commute_time_min) VALUES
(1, 'Sofia Bianchi', 19, 'F', 164, 56, 'Psychology', 'No', 15),
(2, 'Luca Rossi', 21, 'M', 178, 74, 'Engineering', 'Yes', 40),
(3, 'Giulia Conti', 20, 'F', 178, 60, 'Biology', 'No', 10),
(4, 'Matteo Greco', 19, 'M', 180, 82, 'Business', 'Yes', 45),
(5, 'Chiara Esposito', 21, 'F', 160, 52, 'Literature', 'No', 25),
(6, 'Marco De Luca', 21, 'M', 178, 70, 'Computer Science', 'No', 30),
(7, 'Alice Romano', 22, 'F', 178, 65, 'Sociology', 'Yes', 35),
(8, 'Andrea Moretti', 19, 'M', 180, 77, 'Physics', 'No', 20),
(9, 'Francesca Galli', 23, 'F', 164, 59, 'Economics', 'Yes', 50),
(10, 'Davide Ferri', 21, 'M', 180, 68, 'Mathematics', 'No', 15);
