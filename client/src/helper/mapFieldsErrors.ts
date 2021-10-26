import { FieldError } from "../generated/graphql";

export const mapFieldsErrors = (errors: FieldError[]) => {
  return errors.reduce((acc, error) => {
    return {
      ...acc,
      [error.field]: error.message,
    };
  }, {});
};
