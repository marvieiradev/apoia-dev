"use client";
import { useState, ChangeEvent, useRef } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";
import { changeDescription } from "../_actions/change-bio";

export function Description({
  initialDescription,
}: {
  initialDescription: string;
}) {
  const [description, setDescription] = useState(initialDescription);
  const [originalDescription] = useState(initialDescription);

  const debouncedSaveDescription = useRef(
    debounce(async (currentDescription: string) => {
      if (currentDescription.trim() === "") {
        setDescription(originalDescription);
        return;
      }

      if (currentDescription !== description) {
        try {
          const response = await changeDescription({
            description: currentDescription,
          });
          if (response.error) {
            toast.error("Erro ao atualizar a biografia.");
            setDescription(originalDescription);
            return;
          }

          toast.success("Biografia atualizada com sucesso!");
        } catch (error) {
          toast.error("Erro: " + error);
          setDescription(originalDescription);
        }
      }
    }, 1500)
  ).current;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setDescription(value);
    debouncedSaveDescription(value);
  }

  return (
    <textarea
      className="text-base md:text-lg bg-gray-50 border border-gray-100 text-center rounded-md outline-none p-2 w-full max-w-2xl my-3 h-40 resize-none"
      value={description}
      onChange={handleChange}
    />
  );
}
