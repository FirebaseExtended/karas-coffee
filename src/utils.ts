/**
 * Creates an empty array to iterate over.
 * 
 * This is useful when creating a dummy list of items such as loading states.
 * 
 * @param length 
 * @returns 
 */
export function emptyArray(length: number): Array<null> {
  return [...Array(length).fill(null)];
}
