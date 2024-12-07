import Joi from 'joi';

export const generateUploadUrlSchema = Joi.object({
    fileName: Joi.string().min(3).required().messages({
        'string.empty': 'fileName is required',
        'string.min': 'fileName should have a minimum length of {#limit}',
    }),
})