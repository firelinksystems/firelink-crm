export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
  if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid UK phone number';
  }
  return null;
};

export const validatePostcode = (postcode: string): string | null => {
  const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
  if (postcode && !postcodeRegex.test(postcode)) {
    return 'Please enter a valid UK postcode';
  }
  return null;
};

export const validateVATNumber = (vatNumber: string): string | null => {
  const vatRegex = /^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/;
  if (vatNumber && !vatRegex.test(vatNumber.toUpperCase())) {
    return 'Please enter a valid UK VAT number';
  }
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateNumber = (value: any, fieldName: string): string | null => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} must be a number`;
  }
  return null;
};

export const validatePositiveNumber = (value: any, fieldName: string): string | null => {
  const numberError = validateNumber(value, fieldName);
  if (numberError) return numberError;
  
  if (value && Number(value) <= 0) {
    return `${fieldName} must be greater than 0`;
  }
  return null;
};

export const validateDate = (value: string, fieldName: string): string | null => {
  if (value && isNaN(Date.parse(value))) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  return null;
};

export const validateFutureDate = (value: string, fieldName: string): string | null => {
  const dateError = validateDate(value, fieldName);
  if (dateError) return dateError;
  
  if (value && new Date(value) < new Date()) {
    return `${fieldName} must be in the future`;
  }
  return null;
};
