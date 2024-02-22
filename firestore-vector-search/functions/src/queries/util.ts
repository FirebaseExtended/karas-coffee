import { z } from 'zod';

export const parseTopK = (topK: unknown) => {
  // Check if topK is a string or a number, return 1 otherwise
  if (typeof topK !== 'string' && typeof topK !== 'number') {
    throw new Error('topK must be a string or a number');
  }

  // Attempt to parse topK as a float
  const parsedFloat = parseFloat(topK as string);
  const isInteger = Number.isInteger(parsedFloat);

  if (!isInteger || parsedFloat < 1) {
    throw new Error('topK must be an integer greater than 0');
  }

  const parsedInt = parseInt(topK as string);
  return parsedInt;
};

const querySchema = z
  .object({
    query: z.string().optional(),
    limit: z.union([z.string(), z.number()]).optional(),
  })
  .refine(
    (data) => data.query != undefined,
    { message: 'Query field must be provided' }, // Moved the message into an object as the second argument to refine for clarity
  );

export const parseQuerySchema = (data: unknown) => {
  return querySchema.parse(data);
};
