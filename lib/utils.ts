import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export { processExcelFile } from "@/lib/excel-processor"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
