import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { SignInSchema, SignUpSchema, verifyEmailSchema } from "../schemas/auth";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(SignUpSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient({});

      // check if user already exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return {
        success: true,
        sentToEmail: email,
      };
    }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .query(async ({ input }) => {
      const { token } = input;

      const payload = await getPayloadClient({});

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });

      if (!isVerified)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      return {
        success: true,
      };
    }),

  signIn: publicProcedure
    .input(SignInSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { res } = ctx;

      const payload = await getPayloadClient({});

      try {
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
    }),
});
