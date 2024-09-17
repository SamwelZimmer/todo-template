import { Todo } from "@/lib/types";
import TodoCard from "./TodoCard";

export default function TodoList({
  category,
  todos,
}: {
  category: string;
  todos: Todo[];
}) {
  const completedTodos = todos.filter((todo) => todo.status === "completed");

  if (todos.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-baseline">
        <h1 className="text-lg font-semibold mb-4">{category}</h1>

        <span className="text-sm text-muted-foreground">
          {completedTodos.length} / {todos.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
