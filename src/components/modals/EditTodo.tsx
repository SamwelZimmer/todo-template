import * as React from "react";
import { LuTrash2 } from "react-icons/lu";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DefaultTextInput, { SearchInput } from "@/components/common/TextInputs";
import DefaultDropdown from "@/components/common/Dropdown";
import { useTodosContext } from "../providers/todos-context";
import { z } from "zod";
import { NewTodoData, Todo, TodoStatus } from "@/lib/types";
import CategoricalSlider from "../common/CategoricalSlider";

const MODAL_TITLE = "Edit Todo";

export function EditTodo({
  children,
  initialTodo,
}: {
  children: React.ReactNode;
  initialTodo: Todo;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [todoData, setTodoData] = React.useState<Todo>(initialTodo);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>{MODAL_TITLE}</DialogTitle>
          </DialogHeader>
          <ModalContent
            todoData={todoData}
            setTodoData={setTodoData}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="text-left">
          <DrawerTitle>{MODAL_TITLE}</DrawerTitle>
        </DrawerHeader>

        <ModalContent
          todoData={todoData}
          setTodoData={setTodoData}
          setOpen={setOpen}
          isDrawer
        />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="rounded-2xl h-10">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const statusOptions = [
  {
    text: "Pending",
    icon: () => (
      <div className="w-2 h-2 bg-yellow-500 border-yellow-100 rounded-full" />
    ),
  },
  {
    text: "Completed",
    icon: () => <div className="w-2 h-2 bg-green-500 rounded-full" />,
  },
  {
    text: "Started",
    icon: () => <div className="w-2 h-2 bg-blue-500 rounded-full" />,
  },
];

const todoUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().nullable().default("Misc"),
  status: z.enum(["pending", "completed", "started"]),
});

const ModalContent = ({
  todoData,
  setTodoData,
  setOpen,
  isDrawer = false,
}: {
  todoData: Todo;
  setTodoData: React.Dispatch<React.SetStateAction<Todo>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawer?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [activeStatusIdx, setActiveStatusIdx] = React.useState<number | null>(
    statusOptions.findIndex(
      (option) => option.text.toLowerCase() === todoData.status.toLowerCase()
    )
  );

  const { categories, updateTodo, deleteTodo } = useTodosContext();

  const filteredCategories = React.useMemo(() => {
    return categories
      .filter((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((category) => ({
        value: category,
        label: category,
      }));
  }, [categories, searchQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedData = todoUpdateSchema.parse(todoData);

      // Proceed with form submission
      setOpen(false);
      updateTodo(validatedData as Todo);

      setErrorMessage("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors);
        setErrorMessage(error.errors[0].message);
        // Handle validation errors
      }
    }
  };

  React.useEffect(() => {
    setActiveStatusIdx(
      statusOptions.findIndex((option) => option.text === todoData.status)
    );
  }, [todoData.status]);

  React.useEffect(() => {
    setTodoData({
      ...todoData,
      status: todoData.status.toLowerCase() as TodoStatus,
    });
  }, [activeStatusIdx]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex flex-col gap-4 ${isDrawer && "px-4"} mt-4`}
    >
      <CategoricalSlider
        options={statusOptions}
        activeItemIdx={activeStatusIdx}
        setActiveItemIdx={setActiveStatusIdx}
      />

      <DefaultTextInput
        value={todoData.title}
        setValue={(value) => setTodoData({ ...todoData, title: value })}
        placeholder="Todo title (required)"
      />

      {errorMessage && (
        <p className="absolute bottom-[calc(100%+4px)] left-0 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <DefaultTextInput
        value={todoData.description ?? ""}
        setValue={(value) => setTodoData({ ...todoData, description: value })}
        placeholder="Todo description"
      />

      <DefaultDropdown
        placeholder="Select a category"
        options={filteredCategories}
        value={todoData.category ?? undefined}
        onChange={(option) =>
          setTodoData({ ...todoData, category: option.value })
        }
        header={
          <div className="z-10 border-b flex flex-col pb-1">
            <SearchInput
              value={searchQuery}
              setValue={setSearchQuery}
              placeholder="Find categories"
              className="border-none px-2 rounded-xl ring-none outline-none shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none bg-transparent"
            />

            {searchQuery &&
              !filteredCategories.find(
                (category) => category.value === searchQuery
              ) && (
                <>
                  <button
                    onClick={() =>
                      setTodoData({ ...todoData, category: searchQuery })
                    }
                    className="flex gap-2 h-10 cursor-pointer w-full rounded-xl items-center hover:bg-muted text-sm px-4 mt-1"
                  >
                    {"Create category: "}
                    <span className="font-semibold">{searchQuery}</span>
                  </button>
                </>
              )}
          </div>
        }
      />

      <div className="flex gap-4  mt-4">
        <Button
          onClick={() => deleteTodo(todoData.id)}
          variant="destructive"
          className="h-11 rounded-2xl w-max font-semibold"
        >
          <LuTrash2 size={20} />
        </Button>

        <Button
          className="h-11 rounded-2xl px-6 w-full font-semibold"
          type="submit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};
