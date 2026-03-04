import Papa from "papaparse";
import * as XLSX from "xlsx";
import { nanoid } from "nanoid";
import type { DataSource } from "@/stores/data-store";

/**
 * Parse a CSV file into a DataSource
 */
export function parseCSV(file: File): Promise<DataSource> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, any>[];
        const columns = results.meta.fields || [];
        resolve({
          id: nanoid(),
          name: file.name.replace(/\.(csv|tsv)$/i, ""),
          type: "csv",
          data,
          columns,
          createdAt: Date.now(),
        });
      },
      error: (err) => reject(err),
    });
  });
}

/**
 * Parse an Excel file (.xlsx, .xls) into a DataSource
 */
export async function parseExcel(file: File): Promise<DataSource> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return {
    id: nanoid(),
    name: file.name.replace(/\.(xlsx?|xlsm)$/i, ""),
    type: "excel",
    data,
    columns,
    createdAt: Date.now(),
  };
}

/**
 * Parse a JSON file into a DataSource
 */
export async function parseJSON(file: File): Promise<DataSource> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const data = Array.isArray(parsed) ? parsed : [parsed];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return {
    id: nanoid(),
    name: file.name.replace(/\.json$/i, ""),
    type: "json",
    data,
    columns,
    createdAt: Date.now(),
  };
}

/**
 * Auto-detect file type and parse
 */
export async function parseFile(file: File): Promise<DataSource> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "csv":
    case "tsv":
      return parseCSV(file);
    case "xlsx":
    case "xls":
    case "xlsm":
      return parseExcel(file);
    case "json":
      return parseJSON(file);
    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}
