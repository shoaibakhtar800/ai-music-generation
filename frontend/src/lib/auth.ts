import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";
import {
  polar,
  checkout,
  portal,
  webhooks,
} from "@polar-sh/better-auth";
import { revalidatePath } from "next/cache";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "a5b834f5-b586-4c77-a3ea-ca5b87cac1e9",
              slug: "small",
            },
            {
              productId: "20e6fbda-4fec-4336-996e-50abbe2821f0",
              slug: "medium",
            },
            {
              productId: "65ba7330-719e-4a8c-b396-87f3dc04cf1a",
              slug: "large",
            },
          ],
          successUrl: "/",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer ID found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "a5b834f5-b586-4c77-a3ea-ca5b87cac1e9":
                creditsToAdd = 10;
                break;
              case "20e6fbda-4fec-4336-996e-50abbe2821f0":
                creditsToAdd = 25;
                break;
              case "65ba7330-719e-4a8c-b396-87f3dc04cf1a":
                creditsToAdd = 50;
                break;
            }

            await db.user.update({
              where: {
                id: externalCustomerId,
              },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });

            revalidatePath("/");
          },
        }),
      ],
    }),
  ],
});
