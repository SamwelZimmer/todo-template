export type TodoStatus = "pending" | "started" | "completed";

export type NewTodoData = {
  title: string;
  description: string;
  category: string | null;
};

export type Todo = {
  id: string;
  title: string;
  category: string;
  description?: string;
  status: TodoStatus;
};

export type CategoricalSliderItem = {
  text: string;
  icon?: React.ElementType<React.ComponentProps<any>>;
};
