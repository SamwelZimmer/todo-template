import { TodosProvider } from "@/components/providers/todos-context";
import ActionSection from "@/components/todos/ActionSection";
import TodoSection from "@/components/todos/TodoSection";
import { Todo } from "@/lib/types";

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Todo 1",
    description: "Todo 1 description",
    category: "Personal",
    status: "pending",
  },
  {
    id: "2",
    title: "Todo 2",
    category: "Work",
    status: "completed",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Personal",
    status: "started",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Personal",
    status: "started",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Pooper",
    status: "started",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Personal",
    status: "started",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Personal",
    status: "started",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Personal",
    status: "started",
  },
  {
    id: "3",
    title: "Todo 3",
    description: "Todo 3 description",
    category: "Pooper",
    status: "started",
  },
];

export default function TodoPage() {
  return (
    <div className="w-full h-full pt-[calc(57px+24px)] sm:pt-[calc(57px+48px)]">
      <TodosProvider initialTodos={initialTodos}>
        <div className="relative px-6 md:px-0 h-[calc(100vh-57px-24px)] sm:h-[calc(100vh-57px-48px)] max-w-md lg:max-w-none mx-auto overflow-hidden">
          <ActionSection />

          <TodoSection />

          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent" />
        </div>
      </TodosProvider>
    </div>
  );
}
