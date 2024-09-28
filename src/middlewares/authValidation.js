import Joi from 'joi';

// Joi Validation Schemas
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  surname: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  password: Joi.string().min(8)
    .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required(),
});

export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(4).required(),
});

export const loginSchema = Joi.object({
  emailOrPhone: Joi.string().required(),
  password: Joi.string().required(),
});

export const pinSchema = Joi.object({
  pin: Joi.string().length(4).required(),
});

export const facialRecognitionSchema = Joi.object({
  facialData: Joi.string().required(),
});

export const kycSchema = Joi.object({
  idType: Joi.string().valid('NIN').required(),
  idNumber: Joi.string().length(11).required(),
});
