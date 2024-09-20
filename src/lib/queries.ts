"use server";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/next-auth";
import { Todo } from "@prisma/client";
import { db } from "@/lib/db";

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

// // -------- TODOs --------

export async function getAllTodos() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    // fetch all todos associated with the user
    const res = await db.todo.findMany({ where: { user: { id: userId } } });

    return res;
  } catch (err) {
    console.error("Error getting TODOs:", err);
    throw new Error("Error getting TODOs");
  }
}

export async function createTodo(todo: Partial<Todo>) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!todo) {
    throw new Error("Todo is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const res = await db.todo.create({
      data: {
        title: todo.title ?? "Untitled TODO",
        description: todo.description,
        category: todo.category ?? "Misc",
        status: todo.status,
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    return res;
  } catch (err) {
    console.error("Error creating TODO", err);
    throw new Error("Error creating TODO");
  }
}

export async function createManyTodos(todos: Partial<Todo>[]) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!todos || todos.length === 0) {
    throw new Error("At least one Todo is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const res = await db.todo.createMany({
      data: todos.map((todo) => ({
        title: todo.title ?? "Untitled TODO",
        description: todo.description,
        category: todo.category ?? "Misc",
        status: todo.status,
        userId: userId,
      })),
    });

    return res;
  } catch (err) {
    console.error("Error creating TODOs", err);
    throw new Error("Error creating TODOs");
  }
}

export async function updateTodo(todo: Partial<Todo>) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!todo) {
    throw new Error("Todo is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const res = await db.todo.update({
      where: { id: todo.id, userId: userId },
      data: {
        title: todo.title,
        description: todo.description,
        category: todo.category,
        status: todo.status,
      },
    });
    return res;
  } catch (err) {
    console.error("Error updating TODO", err);
    throw new Error("Error updating TODO");
  }
}

export async function deleteTodo(id: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!id) {
    throw new Error("Todo ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const res = await db.todo.delete({
      where: { id: id, userId: userId },
    });
    return res;
  } catch (err) {
    console.error("Error deleting TODO", err);
    throw new Error("Error deleting TODO");
  }
}
