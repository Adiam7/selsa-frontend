// src/lib/auth/password-utils.ts
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// export function isValidPassword(password: string): boolean {
//   // Check if password meets criteria: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
//   return passwordRegex.test(password);
// }
// export function isValidEmail(email: string): boolean {
//   // Simple email validation regex
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }
// export function isValidUsername(username: string): boolean {
//   // Username must be alphanumeric and between 3-20 characters
//   const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
//   return usernameRegex.test(username);
// }
// export function isValidPhoneNumber(phone: string): boolean {
//   // Simple phone number validation (10 digits)
//   const phoneRegex = /^\d{10}$/;
//   return phoneRegex.test(phone);
// }
// export function isValidName(name: string): boolean {
//   // Name must contain only letters and spaces, and be between 2-50 characters
//   const nameRegex = /^[a-zA-Z\s]{2,50}$/;
//   return nameRegex.test(name);
// }
// export function isValidAddress(address: string): boolean {
//   // Address must be between 5-100 characters
//   return address.length >= 5 && address.length <= 100;
// }
// export function isValidZipCode(zip: string): boolean {
//   // Simple zip code validation (5 digits)
//   const zipRegex = /^\d{5}$/;
//   return zipRegex.test(zip);
// }
// export function isValidCity(city: string): boolean {
//   // City must contain only letters and spaces, and be between 2-50 characters
//   const cityRegex = /^[a-zA-Z\s]{2,50}$/;
//   return cityRegex.test(city);
// }
// export function isValidState(state: string): boolean {
//   // State must contain only letters and be between 2-50 characters
//   const stateRegex = /^[a-zA-Z\s]{2,50}$/;
//   return stateRegex.test(state);
// }
// export function isValidCountry(country: string): boolean {
//   // Country must contain only letters and be between 2-50 characters
//   const countryRegex = /^[a-zA-Z\s]{2,50}$/;
//   return countryRegex.test(country);
// }                   
// export function isValidCreditCard(cardNumber: string): boolean {
//   // Simple credit card validation (16 digits)
//   const cardRegex = /^\d{16}$/;
//   return cardRegex.test(cardNumber);
// }
// export function isValidCVV(cvv: string): boolean {
//   // CVV must be 3 digits
//   const cvvRegex = /^\d{3}$/;
//   return cvvRegex.test(cvv);
// }
// export function isValidExpirationDate(expirationDate: string): boolean {
//   // Expiration date must be in MM/YY format
//   const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
//   return expirationRegex.test(expirationDate);
// }
// export function isValidShippingMethod(method: string): boolean {
//   // Shipping method must be one of the predefined options
//   const validMethods = ["standard", "express", "overnight"];
//   return validMethods.includes(method.toLowerCase());
// }
// export function isValidPaymentMethod(method: string): boolean {
//   // Payment method must be one of the predefined options
//   const validMethods = ["credit_card", "paypal", "bank_transfer"];
//   return validMethods.includes(method.toLowerCase());
// }
// export function isValidOrderStatus(status: string): boolean {
//   // Order status must be one of the predefined options
//   const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
//   return validStatuses.includes(status.toLowerCase());
// }
// export function isValidProductCategory(category: string): boolean {
//   // Product category must be one of the predefined options
//   const validCategories = ["electronics", "clothing", "home", "books", "toys"];
//   return validCategories.includes(category.toLowerCase());
// }
// export function isValidProductName(name: string): boolean {
//   // Product name must be between 2-100 characters
//   return name.length >= 2 && name.length <= 100;
// }
// export function isValidProductDescription(description: string): boolean {
//   // Product description must be between 10-500 characters
//   return description.length >= 10 && description.length <= 500;
// }
// export function isValidProductPrice(price: number): boolean {