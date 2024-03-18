import * as z from "zod"

export const EnvironmentVariablesSchema = z.object({
    PORT: z.number(),
    NEXT_PUBLIC_SERVER_URL: z.string(),
    PAYLOAD_SECRET: z.string(),
    MONGODB_URL: z.string(),
    RESEND_API_KEY: z.string(),
    RESEND_SENDER_MAIL: z.string()
})