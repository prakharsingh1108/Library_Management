// Shared validation rules for React Hook Form

export const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
  maxLength: {
    value: 16,
    message: 'Password must be at most 16 characters',
  },
};

export const nameRules = {
  required: 'Name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters',
  },
  maxLength: {
    value: 50,
    message: 'Name must be at most 50 characters',
  },
};

export const otpRules = {
  required: 'OTP is required',
  pattern: {
    value: /^\d{5}$/,
    message: 'OTP must be a 5-digit number',
  },
};

export const confirmPasswordRules = (getValues, fieldName = 'password') => ({
  required: 'Please confirm your password',
  validate: (value) =>
    value === getValues(fieldName) || 'Passwords do not match',
});

export const bookRules = {
  title: {
    required: 'Book title is required',
    minLength: { value: 2, message: 'Title must be at least 2 characters' },
  },
  author: {
    required: 'Author name is required',
    minLength: { value: 2, message: 'Author must be at least 2 characters' },
  },
  genre: {
    required: 'Please select a genre',
  },
  totalCopies: {
    required: 'Total copies is required',
    min: { value: 1, message: 'At least 1 copy is required' },
  },
};
