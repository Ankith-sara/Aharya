import Joi from 'joi';

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};

export const validateRegister = validate(Joi.object({
    name:     Joi.string().min(2).max(50).required(),
    email:    Joi.string().email().required(),
    password: Joi.string().min(8).required()
}));

export const validateLogin = validate(Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().required()
}));

export const validateOtp = validate(Joi.object({
    email: Joi.string().email().required(),
    otp:   Joi.string().length(6).required()
}));

export const validateCoupon = validate(Joi.object({
    code:          Joi.string().required(),
    discountType:  Joi.string().valid('percent', 'flat').required(),
    value:         Joi.number().positive().required(),
    minOrderValue: Joi.number().min(0).default(0),
    expiresAt:     Joi.date().greater('now').required(),
    usageLimit:    Joi.number().positive().allow(null).default(null)
}));

export const validateReview = validate(Joi.object({
    productId: Joi.string().required(),
    rating:    Joi.number().min(1).max(5).required(),
    comment:   Joi.string().max(1000).optional()
}));

export default validate;
