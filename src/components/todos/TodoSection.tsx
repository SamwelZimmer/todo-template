"use client";

import { useTodosContext } from "@/components/providers/todos-context";
import TodoList from "@/components/todos/TodoList";

export default function TodoSection() {
  const { setSearchQuery, categories, filteredTodos, containerHeight } =
    useTodosContext();

  if (filteredTodos.length === 0)
    return (
      <div className="flex flex-col gap-2 w-full pt-4">
        <div className="text-lg font-semibold text-center">No todos found</div>

        <button
          onClick={() => setSearchQuery("")}
          className="underline text-muted-foreground text-sm hover:text-foreground"
        >
          Clear Search
        </button>
      </div>
    );

  return (
    <div
      style={{ height: containerHeight ?? "100%" }}
      className="flex flex-col gap-8 items-center mx-auto max-w-md pt-8 pb-20 overflow-scroll hidden-scrollbar"
    >
      {categories.map((category) => (
        <TodoList
          key={category}
          category={category}
          todos={filteredTodos.filter((todo) => todo.category === category)}
        />
      ))}
    </div>
  );
}
