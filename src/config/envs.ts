import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    MANAGEMENT_DATABASE_URL: string;
    SALTORROUNDS: string;
    CLIENT_DB_URL?: string;
}

//Validador de schema
const envsSchema = joi.object({
    PORT: joi.number().required(),
    MANAGEMENT_DATABASE_URL: joi.string().required(),
    SALTORROUNDS: joi.number().required(),
    CLIENT_DB_URL: joi.string().allow('').optional() 
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Error ${error}`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    MANAGEMENT_DATABASE_URL: envVars.MANAGEMENT_DATABASE_URL,
    SALTORROUNDS: envVars.SALTORROUNDS,
    CLIENT_DB_URL: envVars.CLIENT_DB_URL
}