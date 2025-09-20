import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
      MODAL_KEY: z.string(),
      MODAL_SECRECT: z.string(),
      AWS_ACCESS_KEY_ID: z.string(),
      AWS_SECRET_ACCESS_KEY: z.string(),
      AWS_REGION: z.string(),
      AWS_RESOURCE_ACCESS_DOMAIN: z.string(),
      S3_BUCKET_NAME: z.string(),
      GENERATE_FROM_DESCRIPTION: z.string(),
      GENERATE_WITH_DESCRIBED_LYRICS: z.string(),
      GENERATE_WITH_LYRICS: z.string(),
      BETTER_AUTH_SECRET: z.string(),
      POLAR_ACCESS_TOKEN: z.string(),
      POLAR_WEBHOOK_SECRET: z.string()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    MODAL_KEY: process.env.MODAL_KEY,
    MODAL_SECRECT: process.env.MODAL_SECRECT,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_RESOURCE_ACCESS_DOMAIN: process.env.AWS_RESOURCE_ACCESS_DOMAIN,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    GENERATE_FROM_DESCRIPTION: process.env.GENERATE_FROM_DESCRIPTION,
    GENERATE_WITH_DESCRIBED_LYRICS: process.env.GENERATE_WITH_DESCRIBED_LYRICS,
    GENERATE_WITH_LYRICS: process.env.GENERATE_WITH_LYRICS,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET
    // Add more server-side env vars here...
    // For client-side env vars, make sure to prefix them with `NEXT_PUBLIC_`
    // and add them to the `client` schema above.
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
