"use client";

import { RiAddLargeFill } from "react-icons/ri";

import { useTodosContext } from "@/components/providers/todos-context";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/TextInputs";
import { CreateTodo } from "../modals/CreateTodo";

export default function ActionSection() {
  const { searchQuery, setSearchQuery } = useTodosContext();

  return (
    <div className="flex justify-between gap-4 w-full max-w-md mx-auto relative">
      <SearchInput
        value={searchQuery}
        setValue={setSearchQuery}
        placeholder="Search..."
        className="h-11 w-full"
      />

      <CreateTodo>
        <Button className="h-11 rounded-2xl font-semibold gap-2 px-6">
          <RiAddLargeFill size={16} />

          <span>New</span>
        </Button>
      </CreateTodo>

      <div className="absolute top-full left-0 w-full h-8 bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}
