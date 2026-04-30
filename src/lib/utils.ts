import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price)
}

export async function safeJson(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (e) {
      console.error("JSON parse error:", e);
      return { error: "Failed to parse server response" };
    }
  }
  
  // If not JSON, it's likely an error page or empty
  const text = await response.text();
  return { error: `Server returned non-JSON response: ${text.substring(0, 100)}...` };
}
