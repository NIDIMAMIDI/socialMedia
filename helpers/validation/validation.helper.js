// import vali
export const schemaValidation = async (schema, data) => {
  const { error, value } = await schema.validate(data);
  return error;
};
