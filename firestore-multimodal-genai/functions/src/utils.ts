import * as Mustache from 'mustache';

export function extractFields(
  obj: any,
  fields?: string[]
): Record<string, string> {
  const parsedFields: Record<string, string> = {};
  if (!fields || fields.length === 0) {
    return parsedFields;
  }
  for (const field of fields) {
    if (obj[field] && typeof obj[field] == 'string') {
      parsedFields[field] = obj[field];
    }
  }
  return parsedFields;
}

export function extractHandlebarsVariables(prompt: string) {
  let tokens;
  try {
    tokens = Mustache.parse(prompt);
  } catch (e) {
    throw new Error(`Error parsing handlebars template: ${e}`);
  }

  const variables: string[] = [];

  for (const token of tokens) {
    if (token[0] === '#') {
      throw new Error(
        `Complex handlebars features like ${token[1]} blocks are not supported.`
      );
    } else if (token[0] === 'name') {
      const variable = token[1] as string;
      if (!variable.includes('.')) {
        variables.push(variable);
      } else {
        throw new Error(`Nested variables like ${variable} are not supported.`);
      }
    }
  }

  return variables;
}
