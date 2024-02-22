import { parseTopK, parseQuerySchema } from "./util"; // Adjust the import path as necessary
import { z } from "zod"; // Ensure Zod is imported

describe("parseTopK", () => {
  test("should return the input as is for integer numbers greater than 0", () => {
    expect(parseTopK(5)).toBe(5);
    expect(parseTopK(100)).toBe(100);
  });

  test("should return the input as is for strings representing integer numbers greater than 0", () => {
    expect(parseTopK("5")).toBe(5);
    expect(parseTopK("100")).toBe(100);
  });

  test("should throw an error for floats or strings representing floats", () => {
    expect(() => parseTopK(5.5)).toThrow(
      "topK must be an integer greater than 0"
    );
    expect(() => parseTopK("5.5")).toThrow(
      "topK must be an integer greater than 0"
    );
  });

  test("should throw an error for values less than 1", () => {
    expect(() => parseTopK(0)).toThrow(
      "topK must be an integer greater than 0"
    );
    expect(() => parseTopK(-5)).toThrow(
      "topK must be an integer greater than 0"
    );
    expect(() => parseTopK("0")).toThrow(
      "topK must be an integer greater than 0"
    );
    expect(() => parseTopK("-5")).toThrow(
      "topK must be an integer greater than 0"
    );
  });

  test("should throw an error for inputs that are not numbers or strings", () => {
    expect(() => parseTopK(null)).toThrow("topK must be a string or a number");
    expect(() => parseTopK(undefined)).toThrow(
      "topK must be a string or a number"
    );
    expect(() => parseTopK({})).toThrow("topK must be a string or a number");
    expect(() => parseTopK([])).toThrow("topK must be a string or a number");
  });

  test("should throw an error for strings that are not valid numbers", () => {
    expect(() => parseTopK("abc")).toThrow(
      "topK must be an integer greater than 0"
    );
    expect(() => parseTopK("4.5x")).toThrow(
      "topK must be an integer greater than 0"
    );
  });
});

describe("parseQuerySchema", () => {
  test("should parse valid data with query and topK as a string", () => {
    const data = { query: "example query", topK: "10" };
    expect(parseQuerySchema(data)).toEqual(data);
  });

  test("should parse valid data with query and topK as a number", () => {
    const data = { query: "example query", topK: 10 };
    expect(parseQuerySchema(data)).toEqual(data);
  });

  test("should parse valid data with only query", () => {
    const data = { query: "example query" };
    expect(parseQuerySchema(data)).toEqual(data);
  });

  test("should throw an error if query field is missing or undefined", () => {
    const data = { topK: "10" };
    expect(() => parseQuerySchema(data)).toThrow(z.ZodError);
    expect(() => parseQuerySchema({})).toThrow(z.ZodError);
  });

  test("should throw an error if topK is neither a string nor a number", () => {
    const data = { query: "example query", topK: false };
    expect(() => parseQuerySchema(data)).toThrow(z.ZodError);
  });
});
