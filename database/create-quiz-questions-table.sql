CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    principle VARCHAR(32) NOT NULL,
    guideline_code VARCHAR(10) NOT NULL,
    guideline_name VARCHAR(120) NOT NULL,
    success_criterion VARCHAR(120) NOT NULL,
    question TEXT NOT NULL,
    code_snippet TEXT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    explanation TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_principle (principle),
    INDEX idx_guideline (guideline_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional sample question seed is created by the PHP quiz-data.php fallback.
-- If you want to populate the table manually, you can insert the same 40 questions
-- into this table using the same fields above.
