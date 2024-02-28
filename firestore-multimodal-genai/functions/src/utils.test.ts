import {extractFields, extractHandlebarsVariables} from './utils'; // Adjust the import path as necessary

describe('extractFields', () => {
  const testObj = {
    name: 'John Doe',
    age: '30',
    email: 'john@example.com',
    active: true,
    city: 'New York',
  };

  test('should extract specified string fields from an object', () => {
    const fields = ['name', 'email'];
    const expected = {name: 'John Doe', email: 'john@example.com'};
    const result = extractFields(testObj, fields);
    expect(result).toEqual(expected);
  });

  test('should ignore non-existing fields', () => {
    const fields = ['name', 'nonExistingField'];
    const expected = {name: 'John Doe'}; // nonExistingField is ignored
    const result = extractFields(testObj, fields);
    expect(result).toEqual(expected);
  });

  test('should ignore fields that are not strings', () => {
    const fields = ['name', 'age', 'active']; // 'age' is a string but 'active' is not
    const expected = {name: 'John Doe', age: '30'}; // Only 'name' and 'age' included
    const result = extractFields(testObj, fields);
    expect(result).toEqual(expected);
  });

  test('should return an empty object if fields array is empty', () => {
    const fields: string[] = [];
    const expected = {};
    const result = extractFields(testObj, fields);
    expect(result).toEqual(expected);
  });

  test('should return an empty object if fields is undefined', () => {
    const expected = {};
    const result = extractFields(testObj);
    expect(result).toEqual(expected);
  });

  test('should correctly handle when object has no matching fields', () => {
    const fields = ['nonexistent1', 'nonexistent2'];
    const expected = {};
    const result = extractFields(testObj, fields);
    expect(result).toEqual(expected);
  });

  test('should extract all specified fields when all are present and strings', () => {
    const fields = ['name', 'email', 'city']; // All fields are present and strings
    const expected = {
      name: 'John Doe',
      email: 'john@example.com',
      city: 'New York',
    };
    const result = extractFields(testObj, fields);
    expect(result).toEqual(expected);
  });
});

describe('extractHandlebarsVariables', () => {
  test('should return an empty array for a prompt without variables', () => {
    const prompt = 'This is a plain prompt without variables';
    const variables = extractHandlebarsVariables(prompt);
    expect(variables).toEqual([]);
  });

  test('should correctly extract handlebars variables from a prompt', () => {
    const prompt = 'Hello {{name}}, how are you today?';
    const variables = extractHandlebarsVariables(prompt);
    expect(variables).toEqual(['name']);
  });

  test('should correctly extract multiple handlebars variables from a prompt', () => {
    const prompt = 'Hello {{firstName}}, how is {{pronoun}} doing?';
    const variables = extractHandlebarsVariables(prompt);
    expect(variables).toEqual(['firstName', 'pronoun']);
  });

  test('should throw on nested handlebars variables', () => {
    const prompt = 'Hello {{person.name}}, how is {{person.pronoun}} doing?';
    expect(() => extractHandlebarsVariables(prompt)).toThrow();
  });

  test('should throw on complex handlebars templates', () => {
    const prompt = `
    {{#each items}}
      <li>{{name}}</li>
    {{/each}}
  `;
    expect(() => extractHandlebarsVariables(prompt)).toThrow();
  });
  test('should handle handlebars variables with spaces', () => {
    const prompt = 'Hello {{first name}}, how is {{pronoun}} doing?';
    const variables = extractHandlebarsVariables(prompt);
    expect(variables).toEqual(['first name', 'pronoun']);
  });

  test('should handle handlebars variables with numbers', () => {
    const prompt = 'The product {{product1}} has a price of {{price1}}.';
    const variables = extractHandlebarsVariables(prompt);
    expect(variables).toEqual(['product1', 'price1']);
  });
});
