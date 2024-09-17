import { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { compare } from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    // extract email from query parameters
    const email = req.nextUrl.searchParams.get("email");
    const password = req.nextUrl.searchParams.get("password");

    // throw error if cannot get email from url
    if (!email || !password) {
      return new Response(
        JSON.stringify({ user: null, message: "Invalid query parameter" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // check if user already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    // throw error if user not found
    if (!existingUserByEmail) {
      return new Response(
        JSON.stringify({ user: null, message: "Cannot find user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!existingUserByEmail.password) {
      return new Response(
        JSON.stringify({ user: null, message: "User has no password" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // check passwords match and otherwise throw error
    const passwordsMatch = await compare(
      password,
      existingUserByEmail.password
    );
    if (!passwordsMatch) {
      return new Response(
        JSON.stringify({ user: null, message: "Invalid password" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        user: existingUserByEmail,
        message: "User data collected successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: `Something went wrong: ${err}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
