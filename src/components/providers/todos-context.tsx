"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { toast } from "sonner";
import { RiAddLargeFill, RiDatabase2Line } from "react-icons/ri";

import { useMounted } from "@/hooks/use-mounted";
import { useContainerHeight } from "@/hooks/use-media-query";
import { NewTodoData } from "@/lib/types";
import { CreateTodo } from "@/components/modals/CreateTodo";
import { Button } from "@/components/ui/button";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  createManyTodos,
  getAllTodos,
} from "@/lib/queries";
import { Todo } from "@prisma/client";
import { PRE_MADE_TODOS } from "@/lib/data";

interface TodosContextProps {
  allTodos: Todo[];
  filteredTodos: Todo[];
  setAllTodos: (todos: Todo[]) => void;
  categories: string[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addTodo: (newTodo: NewTodoData) => void;
  patchTodo: (updatedTodo: Todo) => void;
  removeTodo: (id: string) => void;
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

  const [allTodos, setAllTodos] = useState<Todo[]>(initialTodos);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ref, containerHeight] = useContainerHeight([mounted, allTodos]);

  let filteredTodos = allTodos;
  if (searchQuery) {
    filteredTodos = allTodos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const categories = useMemo(() => {
    return Array.from(new Set(allTodos.map((todo) => todo.category)));
  }, [allTodos]);

  const addTodo = async (newTodo: NewTodoData) => {
    setLoading(true);

    const simpleTodo = {
      title: newTodo.title,
      description: newTodo.description ?? "",
      category: newTodo.category ?? "Misc",
      status: "pending",
    };

    // store old data
    const currentTodos = allTodos;
    try {
      // keep track of the id used in the optimistic item
      const tempId = Date.now().toString();

      // optimistic state update
      setAllTodos([
        {
          ...simpleTodo,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "defaultUserId",
          id: tempId,
        },
        ...allTodos,
      ]);

      // add todo to db
      const res = await createTodo(simpleTodo);

      // replace temporary todo with real one
      setAllTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === tempId ? { ...res, id: res.id } : todo
        )
      );

      toast.success("Todo added");
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const patchTodo = async (updatedTodo: Todo) => {
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

      // update todo to db
      const res = await updateTodo(updatedTodo);

      // replace optimistic item with real one
      setAllTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? { ...res, id: res.id } : todo
        )
      );

      toast.success("Todo updated");
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id: string) => {
    setLoading(true);

    // store old data
    const currentTodos = allTodos;
    try {
      // optimistic state update
      setAllTodos(allTodos.filter((todo) => todo.id !== id));

      // delete todo from db
      await deleteTodo(id);

      toast.success("Todo deleted");
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to delete todo");
    } finally {
      setLoading(false);
    }
  };

  const addPreMadeTodos = async () => {
    setLoading(true);

    // store old data
    const currentTodos = allTodos;

    try {
      // add all the items to db
      await createManyTodos(PRE_MADE_TODOS);

      // fetch all the items from db
      const res = await getAllTodos();

      // loop through each item and add them to allTodos with a timeout
      for (const todo of res) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms timeout
        setAllTodos((prevTodos) => [...prevTodos, todo]);
      }
    } catch (error) {
      // revert optimistic state update
      setAllTodos(currentTodos);
      toast.error("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const populateListToast = () => {
    toast.info("Do you want to populate your list with pre-made todos?", {
      action: {
        label: "Yes please",
        onClick: () => addPreMadeTodos(),
      },
    });
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
          patchTodo,
          removeTodo,
          containerHeight,
        }}
      >
        <Button
          onClick={populateListToast}
          variant="secondary"
          className="fixed bottom-6 right-6 z-20 aspect-square h-12 w-12 px-0 rounded-3xl rounded-br-md shadow"
        >
          <RiDatabase2Line size={24} />
        </Button>
        {
          <div ref={ref}>
            {allTodos.length === 0 ? <EmptyState /> : children}
          </div>
        }
      </TodosContext.Provider>
    );
  }

  return <></>;
};

const EmptyState = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <span className="font-bold text-2xl mt-16">
        {"You haven't got any TODOs"}
      </span>
      <span className="text-muted-foreground text-sm mt-2">
        {"We can't be having that"}
      </span>

      <CreateTodo>
        <Button className="h-11 rounded-2xl font-semibold gap-2 px-6 mt-8">
          <RiAddLargeFill size={16} />

          <span>New TODO</span>
        </Button>
      </CreateTodo>
    </div>
  );
};
