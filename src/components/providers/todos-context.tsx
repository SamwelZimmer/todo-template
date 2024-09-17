"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { toast } from "sonner";

import { useMounted } from "@/hooks/use-mounted";
import { useContainerHeight } from "@/hooks/use-media-query";
import { Todo, NewTodoData } from "@/lib/types";

interface TodosContextProps {
  allTodos: Todo[];
  filteredTodos: Todo[];
  setAllTodos: (todos: Todo[]) => void;
  categories: string[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTodo: (newTodo: NewTodoData) => void;
  updateTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: string) => void;
  containerHeight: number;
}

const TodosContext = createContext<TodosContextProps | undefined>(undefined);

export const useTodosContext = () => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodosContext must be used within a TodosProvider");
  }
  return context;
};

export const TodosProvider = ({
  children,
  initialTodos,
}: {
  children: ReactNode;
  initialTodos: Todo[];
}) => {
  const mounted = useMounted();
  const [ref, containerHeight] = useContainerHeight([mounted]);

  const [allTodos, setAllTodos] = useState<Todo[]>(initialTodos);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  let filteredTodos = allTodos;
  if (searchQuery) {
    filteredTodos = allTodos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const categories = useMemo(() => {
    return Array.from(new Set(allTodos.map((todo) => todo.category)));
  }, [allTodos]);

  const addTodo = (newTodo: NewTodoData) => {
    setLoading(true);

    // store old data
    const currentTodos = allTodos;
    try {
      // optimistic state update
      setAllTodos([
        {
          id: Date.now().toString(),
          ...newTodo,
          category: newTodo.category ?? "Misc",
          status: "pending",
        },
        ...allTodos,
      ]);

      // TODO: add todo to db

      toast.success("Todo added");
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = (updatedTodo: Todo) => {
    setLoading(true);

    // store old data
    const currentTodos = allTodos;
    try {
      // optimistic state update
      setAllTodos(
        allTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );

      // TODO: update todo to db

      toast.success("Todo updated");
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = (id: string) => {
    setLoading(true);

    // store old data
    const currentTodos = allTodos;
    try {
      // optimistic state update
      setAllTodos(allTodos.filter((todo) => todo.id !== id));

      // TODO: delete todo from db

      toast.success("Todo deleted");
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to delete todo");
    } finally {
      setLoading(false);
    }
  };

  if (mounted) {
    return (
      <TodosContext.Provider
        value={{
          allTodos,
          setAllTodos,
          categories,
          filteredTodos,
          loading,
          searchQuery,
          setSearchQuery,
          addTodo,
          updateTodo,
          deleteTodo,
          containerHeight,
        }}
      >
        <div ref={ref}>{children}</div>
      </TodosContext.Provider>
    );
  }

  return <></>;
};
