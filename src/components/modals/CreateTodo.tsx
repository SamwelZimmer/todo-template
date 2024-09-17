import * as React from "react";

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
import { NewTodoData } from "@/lib/types";

const MODAL_TITLE = "Create Todo";
const MODAL_DESCRIPTION = "Create a new todo to keep track of your tasks.";

export function CreateTodo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [newTodoData, setNewTodoData] = React.useState<NewTodoData>({
    title: "",
    description: "",
    category: null,
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>{MODAL_TITLE}</DialogTitle>
            <DialogDescription>{MODAL_DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <ModalContent
            newTodoData={newTodoData}
            setNewTodoData={setNewTodoData}
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
          <DrawerDescription>{MODAL_DESCRIPTION}</DrawerDescription>
        </DrawerHeader>

        <ModalContent
          newTodoData={newTodoData}
          setNewTodoData={setNewTodoData}
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

const newTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().nullable(),
});

const ModalContent = ({
  newTodoData,
  setNewTodoData,
  setOpen,
  isDrawer = false,
}: {
  newTodoData: NewTodoData;
  setNewTodoData: React.Dispatch<React.SetStateAction<NewTodoData>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawer?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const { categories, addTodo } = useTodosContext();

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
      const validatedData = newTodoSchema.parse(newTodoData);

      // Proceed with form submission
      setOpen(false);
      addTodo(validatedData as NewTodoData);

      setErrorMessage("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors);
        setErrorMessage(error.errors[0].message);
        // Handle validation errors
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex flex-col gap-4 ${isDrawer && "px-4"} mt-4`}
    >
      <DefaultTextInput
        value={newTodoData.title}
        setValue={(value) => setNewTodoData({ ...newTodoData, title: value })}
        placeholder="Todo title (required)"
      />

      {errorMessage && (
        <p className="absolute bottom-[calc(100%+4px)] left-0 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <DefaultTextInput
        value={newTodoData.description}
        setValue={(value) =>
          setNewTodoData({ ...newTodoData, description: value })
        }
        placeholder="Todo description"
      />

      <DefaultDropdown
        placeholder="Select a category"
        options={filteredCategories}
        value={newTodoData.category ?? undefined}
        onChange={(option) =>
          setNewTodoData({ ...newTodoData, category: option.value })
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
                      setNewTodoData({ ...newTodoData, category: searchQuery })
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

      <Button
        className="h-11 rounded-2xl px-6 w-full font-semibold mt-4"
        type="submit"
      >
        Create Todo
      </Button>
    </form>
  );
};
