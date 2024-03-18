import { EnvironmentVariablesSchema } from "@/schemas/environment-variables";

import { z } from "zod";

const {
  PORT,
  NEXT_PUBLIC_SERVER_URL,
  PAYLOAD_SECRET,
  MONGODB_URL,
  RESEND_API_KEY,
  RESEND_SENDER_MAIL,
} = process.env;

const EnvironmentVariablesObject = {
  PORT: Number(PORT),
  NEXT_PUBLIC_SERVER_URL,
  PAYLOAD_SECRET,
  MONGODB_URL,
  RESEND_API_KEY,
  RESEND_SENDER_MAIL,
};

const parsedResults = EnvironmentVariablesSchema.safeParse(
  EnvironmentVariablesObject
);

if (!parsedResults.success) {
  console.log(parsedResults.error);
  throw new Error("Invalid environment variables");
}

type EnvironmentVariablesSchemaType = z.infer<
  typeof EnvironmentVariablesSchema
>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariablesSchemaType {}
  }
}
