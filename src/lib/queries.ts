"use server";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/next-auth";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// // -------- USERS --------

// checks the user exists and if their credentials are valid
export async function checkUserExistsAndCorrectCredentials(
  email: string,
  password: string
) {
  const response = await fetch(
    `${baseUrl}/api/auth?email=${email}&password=${password}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = await response.json();

  return data.user;
}
