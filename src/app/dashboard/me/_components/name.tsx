"use client";
import { useState, ChangeEvent, useRef } from "react";
import { debounce } from "lodash";
import { changeName } from "../_actions/change-name";
import { toast } from "sonner";

export function Name({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [originalName] = useState(initialName);

  const debouncedSaveName = useRef(
    debounce(async (currentName: string) => {
      if (currentName.trim() === "") {
        setName(originalName);
        return;
      }

      if (currentName !== name) {
        try {
          const response = await changeName({ name: currentName });
          if (response.error) {
            toast.error("Erro ao atualizar o nome.");
            setName(originalName);
            return;
          }

          toast.success("Nome atualizado com sucesso!");
        } catch (error) {
          toast.error("Erro: " + error);
          setName(originalName);
        }
      }
    }, 500)
  ).current;

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    debouncedSaveName(value);
  }

  return (
    <input
      className="text-xl md:text-2xl font-bold bg-gray-50 border border-gray-100 rounded-md outline-none p-2 w-full max-w-2xl text-center my-3"
      value={name}
      onChange={handleChangeName}
    />
  );
}
