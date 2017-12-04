import * as Joi from "joi";

export type PropertyValidationSchema = Joi.Schema | Joi.Schema[];
export type ValidationMetadata<T> = Map<keyof T, PropertyValidationSchema>;
export type NullableValidationMetadata<T> = ValidationMetadata<T> | undefined;
