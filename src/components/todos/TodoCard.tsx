import { TodoStatus } from "@/lib/types";
import { Todo } from "@prisma/client";
import { EditTodo } from "../modals/EditTodo";

export default function TodoCard({ todo }: { todo: Todo }) {
  return (
    <EditTodo initialTodo={todo}>
      <div className="bg-card cursor-pointer hover:bg-muted border shadow rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-4 justify-between">
          <span className="font-semibold truncate">{todo.title}</span>

          <StatusBadge status={todo.status as TodoStatus} />
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
    pending: "rich-warning-container",
    started: "rich-info-container",
    completed: "rich-success-container",
  };

  return (
    <span
      className={`px-2 rounded-full text-xs py-0.5 border ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};
