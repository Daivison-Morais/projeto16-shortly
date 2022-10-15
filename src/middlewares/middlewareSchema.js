import joi from "joi";

const postShortenSchema = joi.object({
  url: joi.string().uri().required(),
});

async function validUrl(req, res, next) {
  const { url } = req.body;
  const validation = postShortenSchema.validate({ url });
  if (validation.error) {
    const error = validation.error.details[0].message;
    return res.status(422).send(error);
  }
  res.locals.url = url;
  next();
}

export { validUrl };
