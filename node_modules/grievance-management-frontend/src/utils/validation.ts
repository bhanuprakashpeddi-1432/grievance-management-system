// Common validation patterns and utilities

export const ValidationPatterns = {
  // Indian mobile number pattern (10 digits starting with 6-9)
  MOBILE_NUMBER: /^[6-9]\d{9}$/,
  
  // Email pattern (basic email validation)
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Alphanumeric pattern for register ID
  ALPHANUMERIC: /^[A-Za-z0-9]+$/,
  
  // Name pattern (letters and spaces only)
  NAME: /^[A-Za-z\s]+$/,
  
  // Password pattern (minimum 8 characters, at least one letter and one number)
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
};

export const ValidationMessages = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, length: number) => `${field} must be at least ${length} characters long`,
  MAX_LENGTH: (field: string, length: number) => `${field} cannot exceed ${length} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_MOBILE: 'Please enter a valid 10-digit mobile number',
  INVALID_FORMAT: (field: string) => `${field} format is invalid`,
  SELECT_AT_LEAST_ONE: (field: string) => `Please select at least one ${field}`
};

// Custom validation functions
export const validateMobileNumber = (value: string): boolean => {
  return ValidationPatterns.MOBILE_NUMBER.test(value);
};

export const validateEmail = (value: string): boolean => {
  return ValidationPatterns.EMAIL.test(value);
};

export const validateName = (value: string): boolean => {
  return ValidationPatterns.NAME.test(value) && value.length >= 2;
};

export const validateRegisterId = (value: string): boolean => {
  return ValidationPatterns.ALPHANUMERIC.test(value) && value.length >= 3;
};

// File validation utilities
export const validateFileSize = (file: File, maxSizeMB = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(`.${fileExtension}`);
};

export const getAllowedFileTypes = (): string[] => {
  return ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
};
