import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 export function checkData(formData : any) {
  const { name, dob, email, phone } = formData;
  return (
    name.trim() !== "" &&
    dob.trim() !== "" &&
    (email.trim() !== "" || phone.trim() !== "") &&
    (email.trim() === "" || checkEmail(email)) &&
    (phone.trim() === "" || checkPhone(phone))
  );
}

export function checkEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function checkPhone(phone: string) {
  const re = /^\d{10}$/;
  return re.test(phone);
}

export function checkDOB(dob: string) {
  const re = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD format
  if (!re.test(dob)) {
    return false;
  }
  const [year, month, day] = dob.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
