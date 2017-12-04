import * as Joi from "joi";
import { METADATA_KEY } from "./constants";
import { createSchemaFromMetadata } from "./schema";
import { NullableValidationMetadata, PropertyValidationSchema } from "./interfaces";
import { noMetadataWasFound } from "./error";

export function validate<T>(instance: T) {
    const constructor = Object.getPrototypeOf(instance).constructor;
    const metadata: NullableValidationMetadata<T> = Reflect.getMetadata(
        METADATA_KEY.VALIDATION_RULES,
        constructor
    );
    if (metadata === undefined) {
        const msg = ``;
        throw new Error(noMetadataWasFound(constructor.name));
    } else {
        const schema = createSchemaFromMetadata<T>(metadata);
        return Joi.validate(instance, schema);
    }
}
