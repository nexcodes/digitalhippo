import { User } from "@/payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  try {
    const token = cookies.get("payload-token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      { 
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );

    const data = await res.json();

    const { user } = data as { user: User | null };

    return {
      user,
    };
  } catch (error) {
    console.log(error, "getServerSideUser");
    return {
      user: null,
    };
  }
};
