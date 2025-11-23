import Joi from 'joi';

export const customerValidation = {
  create: Joi.object({
    companyName: Joi.string().optional(),
    contactName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    postcode: Joi.string().optional(),
    country: Joi.string().default('UK'),
    vatNumber: Joi.string().pattern(/^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/).optional()
  }),

  update: Joi.object({
    companyName: Joi.string().optional(),
    contactName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    postcode: Joi.string().optional(),
    vatNumber: Joi.string().pattern(/^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/).optional()
  })
};

export const jobValidation = {
  create: Joi.object({
    customerId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    jobType: Joi.string().valid('INSTALLATION', 'SERVICE', 'MAINTENANCE', 'EMERGENCY', 'QUOTE').required(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY').default('MEDIUM'),
    scheduledStart: Joi.date().optional(),
    scheduledEnd: Joi.date().optional(),
    estimatedHours: Joi.number().positive().optional()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'INVOICED').required()
  })
};

export const invoiceValidation = {
  create: Joi.object({
    jobId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    dueDate: Joi.date().required()
  })
};

export const paymentValidation = {
  process: Joi.object({
    invoiceId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string().valid('CARD', 'BANK_TRANSFER', 'DIRECT_DEBIT', 'CASH').required(),
    paymentType: Joi.string().required()
  })
};
