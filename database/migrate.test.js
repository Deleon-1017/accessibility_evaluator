/**
 * Unit tests for WCAG Database Migration Script
 * Tests for Task 2.2: Source data parsing and validation
 * 
 * Requirements: 2.1, 2.2, 2.5
 */

const fs = require('fs');
const path = require('path');
const WCAGMigration = require('./migrate.js');

describe('WCAGMigration - Source Data Parsing and Validation', () => {
  let migration;

  beforeEach(() => {
    // Create a new migration instance for each test
    migration = new WCAGMigration({
      host: 'localhost',
      port: 3306,
      user: 'test_user',
      password: 'test_pass',
      database: 'test_db'
    });
  });

  describe('loadSourceData', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const validSourceFile = path.join(testDataDir, 'valid-wcag-data.js');
    const invalidSourceFile = path.join(testDataDir, 'invalid-wcag-data.js');
    const emptySourceFile = path.join(testDataDir, 'empty-wcag-data.js');

    beforeAll(() => {
      // Create test data directory
      if (!fs.existsSync(testDataDir)) {
        fs.mkdirSync(testDataDir, { recursive: true });
      }

      // Create valid test data file
      const validContent = `const wcagGuidelines = [
  {
    "id": "1.1.1",
    "principle": "Perceivable",
    "title": "Non-text Content",
    "level": "A",
    "description": "All non-text content has a text alternative.",
    "explanation": "Images must have alt text.",
    "techniques": ["G94", "G95"]
  },
  {
    "id": "2.1.1",
    "principle": "Operable",
    "title": "Keyboard",
    "level": "A",
    "description": "All functionality is available from a keyboard.",
    "techniques": ["G202"]
  }
];`;
      fs.writeFileSync(validSourceFile, validContent);

      // Create invalid test data file (malformed JSON)
      const invalidContent = `const wcagGuidelines = [
  {
    id: "1.1.1",
    principle: "Perceivable",
    title: "Non-text Content",
    level: "A",
    description: "All non-text content has a text alternative.",
    // Missing closing brace
];`;
      fs.writeFileSync(invalidSourceFile, invalidContent);

      // Create empty test data file
      const emptyContent = `// No wcagGuidelines array here
const someOtherData = [];`;
      fs.writeFileSync(emptySourceFile, emptyContent);
    });

    afterAll(() => {
      // Clean up test data files
      if (fs.existsSync(testDataDir)) {
        fs.rmSync(testDataDir, { recursive: true, force: true });
      }
    });

    test('should successfully parse valid wcag-data.js file', () => {
      const data = migration.loadSourceData(validSourceFile);
      
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data[0].id).toBe('1.1.1');
      expect(data[0].principle).toBe('Perceivable');
      expect(data[1].id).toBe('2.1.1');
    });

    test('should extract wcagGuidelines array correctly', () => {
      const data = migration.loadSourceData(validSourceFile);
      
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('principle');
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('level');
      expect(data[0]).toHaveProperty('description');
    });

    test('should throw error if source file does not exist', () => {
      const nonExistentFile = path.join(testDataDir, 'does-not-exist.js');
      
      expect(() => {
        migration.loadSourceData(nonExistentFile);
      }).toThrow('Source file not found');
    });

    test('should throw error if wcagGuidelines array is not found', () => {
      expect(() => {
        migration.loadSourceData(emptySourceFile);
      }).toThrow('Could not find wcagGuidelines array in source file');
    });

    test('should throw error if file contains invalid JSON', () => {
      expect(() => {
        migration.loadSourceData(invalidSourceFile);
      }).toThrow('Failed to load source data');
    });

    test('should parse techniques array correctly', () => {
      const data = migration.loadSourceData(validSourceFile);
      
      expect(Array.isArray(data[0].techniques)).toBe(true);
      expect(data[0].techniques).toEqual(['G94', 'G95']);
    });
  });

  describe('validateCriterion', () => {
    test('should validate a valid criterion without errors', () => {
      const validCriterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A',
        description: 'All non-text content has a text alternative.'
      };

      expect(() => {
        migration.validateCriterion(validCriterion);
      }).not.toThrow();
    });

    test('should throw error if id is missing', () => {
      const criterion = {
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Missing required field: id');
    });

    test('should throw error if principle is missing', () => {
      const criterion = {
        id: '1.1.1',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Missing required field: principle');
    });

    test('should throw error if title is missing', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        level: 'A',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Missing required field: title');
    });

    test('should throw error if level is missing', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Missing required field: level');
    });

    test('should throw error if description is missing', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Missing required field: description');
    });

    test('should throw error for invalid criterion ID format', () => {
      const criterion = {
        id: 'invalid-id',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Invalid criterion ID format');
    });

    test('should accept valid criterion ID formats', () => {
      const validIds = ['1.1.1', '2.4.7', '10.15.20'];

      validIds.forEach(id => {
        const criterion = {
          id,
          principle: 'Perceivable',
          title: 'Test',
          level: 'A',
          description: 'Test description'
        };

        expect(() => {
          migration.validateCriterion(criterion);
        }).not.toThrow();
      });
    });

    test('should reject invalid criterion ID formats', () => {
      const invalidIds = ['1.1', '1', 'a.b.c', '1.1.1.1'];

      invalidIds.forEach(id => {
        const criterion = {
          id,
          principle: 'Perceivable',
          title: 'Test',
          level: 'A',
          description: 'Test description'
        };

        expect(() => {
          migration.validateCriterion(criterion);
        }).toThrow('Invalid criterion ID format');
      });
    });

    test('should throw error for invalid principle value', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'InvalidPrinciple',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Invalid principle');
    });

    test('should accept all valid principle values', () => {
      const validPrinciples = ['Perceivable', 'Operable', 'Understandable', 'Robust'];

      validPrinciples.forEach(principle => {
        const criterion = {
          id: '1.1.1',
          principle,
          title: 'Test',
          level: 'A',
          description: 'Test description'
        };

        expect(() => {
          migration.validateCriterion(criterion);
        }).not.toThrow();
      });
    });

    test('should throw error for invalid level value', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'B',
        description: 'Description'
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Invalid level');
    });

    test('should accept all valid level values', () => {
      const validLevels = ['A', 'AA', 'AAA'];

      validLevels.forEach(level => {
        const criterion = {
          id: '1.1.1',
          principle: 'Perceivable',
          title: 'Test',
          level,
          description: 'Test description'
        };

        expect(() => {
          migration.validateCriterion(criterion);
        }).not.toThrow();
      });
    });

    test('should validate optional explanation field type', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description',
        explanation: 123 // Should be string
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Field "explanation" must be a string');
    });

    test('should validate optional techniques field type', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description',
        techniques: 'not-an-array' // Should be array
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).toThrow('Field "techniques" must be an array');
    });

    test('should accept valid optional fields', () => {
      const criterion = {
        id: '1.1.1',
        principle: 'Perceivable',
        title: 'Non-text Content',
        level: 'A',
        description: 'Description',
        explanation: 'This is an explanation',
        techniques: ['G94', 'G95']
      };

      expect(() => {
        migration.validateCriterion(criterion);
      }).not.toThrow();
    });
  });

  describe('validateData', () => {
    test('should validate an array of valid criteria', () => {
      const validData = [
        {
          id: '1.1.1',
          principle: 'Perceivable',
          title: 'Non-text Content',
          level: 'A',
          description: 'Description 1'
        },
        {
          id: '2.1.1',
          principle: 'Operable',
          title: 'Keyboard',
          level: 'A',
          description: 'Description 2'
        }
      ];

      expect(() => {
        migration.validateData(validData);
      }).not.toThrow();
    });

    test('should throw error if data is not an array', () => {
      const invalidData = { id: '1.1.1' };

      expect(() => {
        migration.validateData(invalidData);
      }).toThrow('Data must be an array');
    });

    test('should throw error if data array is empty', () => {
      const emptyData = [];

      expect(() => {
        migration.validateData(emptyData);
      }).toThrow('Data array is empty');
    });

    test('should throw error if any criterion is invalid', () => {
      const dataWithInvalidCriterion = [
        {
          id: '1.1.1',
          principle: 'Perceivable',
          title: 'Non-text Content',
          level: 'A',
          description: 'Description 1'
        },
        {
          id: '2.1.1',
          principle: 'InvalidPrinciple', // Invalid
          title: 'Keyboard',
          level: 'A',
          description: 'Description 2'
        }
      ];

      expect(() => {
        migration.validateData(dataWithInvalidCriterion);
      }).toThrow('Validation failed');
      expect(() => {
        migration.validateData(dataWithInvalidCriterion);
      }).toThrow('Invalid principle');
    });

    test('should detect duplicate criterion IDs', () => {
      const dataWithDuplicates = [
        {
          id: '1.1.1',
          principle: 'Perceivable',
          title: 'Non-text Content',
          level: 'A',
          description: 'Description 1'
        },
        {
          id: '1.1.1', // Duplicate ID
          principle: 'Perceivable',
          title: 'Another Title',
          level: 'AA',
          description: 'Description 2'
        }
      ];

      expect(() => {
        migration.validateData(dataWithDuplicates);
      }).toThrow('Duplicate criterion ID found: 1.1.1');
    });

    test('should report multiple validation errors', () => {
      const dataWithMultipleErrors = [
        {
          id: 'invalid-id',
          principle: 'Perceivable',
          title: 'Test',
          level: 'A',
          description: 'Description'
        },
        {
          id: '2.1.1',
          principle: 'InvalidPrinciple',
          title: 'Test',
          level: 'A',
          description: 'Description'
        }
      ];

      expect(() => {
        migration.validateData(dataWithMultipleErrors);
      }).toThrow('Validation failed with 2 error(s)');
    });

    test('should include criterion index and ID in error messages', () => {
      const dataWithError = [
        {
          id: '1.1.1',
          principle: 'Perceivable',
          title: 'Test',
          level: 'A',
          description: 'Description'
        },
        {
          id: '2.1.1',
          principle: 'InvalidPrinciple',
          title: 'Test',
          level: 'A',
          description: 'Description'
        }
      ];

      expect(() => {
        migration.validateData(dataWithError);
      }).toThrow('Criterion at index 1 (ID: 2.1.1)');
    });
  });
});
