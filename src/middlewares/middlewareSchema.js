import joi from "joi";

const postSignupSchema = joi.object({
  name: joi.string().trim().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(5).required(),
  confirmPassword: joi.string().min(5).required(),
});

const postSigninSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().required(),
});

const postShortenSchema = joi.object({
  url: joi.string().uri().required(),
});

function signupSchema(req, res, next) {
  const validation = postSignupSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((value) => value.message);
    return res.status(422).send(errors);
  }
  next();
}

function signinSchema(req, res, next) {
  const validation = postSigninSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((value) => value.message);
    return res.status(422).send(errors);
  }

  next();
}

function validUrl(req, res, next) {
  const { url } = req.body;
  const validation = postShortenSchema.validate({ url });
  if (validation.error) {
    const error = validation.error.details[0].message;
    return res.status(422).send(error);
  }

  const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  if (!regexUrl) {
    return res.status(422).send("url invalida");
  }

  res.locals.url = url;
  next();
}

export { validUrl, signupSchema, signinSchema };
