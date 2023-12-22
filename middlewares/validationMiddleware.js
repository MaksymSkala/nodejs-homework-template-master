import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().required().error(new Error('missing required name field')),
  email: Joi.string().email().required().error(new Error('missing required email field')),
  phone: Joi.string().required().error(new Error('missing required phone field')),
});

const validateContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    await contactSchema.validateAsync({ name, email, phone }, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessage = error.message.includes('missing required')
      ? error.message
      : `${error.details.map((detail) => `*${detail.context.label}* ${detail.message}`).join(', ')}`;

    res.status(400).json({ message: errorMessage });
  }
};

export default {
  validateContact,
};