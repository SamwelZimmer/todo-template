import { Todo, TodoStatus } from "@/lib/types";
import { EditTodo } from "../modals/EditTodo";

export default function TodoCard({ todo }: { todo: Todo }) {
  return (
    <EditTodo initialTodo={todo}>
      <div className="bg-card cursor-pointer hover:bg-muted border shadow rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-4 justify-between">
          <span className="font-semibold truncate">{todo.title}</span>

          <StatusBadge status={todo.status} />
        </div>

        {todo.description && (
          <span className="text-sm text-muted-foreground line-clamp-2">
            {todo.description}
          </span>
        )}
      </div>
    </EditTodo>
  );
}

const StatusBadge = ({ status }: { status: TodoStatus }) => {
  const statusStyles = {
    pending: {
      border: "border-yellow-500",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
    started: {
      border: "border-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
    completed: {
      border: "border-green-500",
      bg: "bg-green-100",
      text: "text-green-700",
    },
  };

  const { border, bg, text } = statusStyles[status];

  return (
    <span
      className={`px-2 rounded-full text-xs py-0.5 border ${border} ${bg} ${text}`}
    >
      {status}
    </span>
  );
};
