"use client";
import { Button } from "@/components/ui/button";
import { set } from "lodash";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAccountButton() {
  const [loadind, setLoading] = useState(false);

  async function handleCreateStripeAccount() {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/stripe/create-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Erro ao criar conta de pagamento");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      setLoading(false);
    }
  }
  return (
    <div className="mb-5">
      <Button
        className="cursor-pointer"
        onClick={handleCreateStripeAccount}
        disabled={loadind}
      >
        {loadind ? "Carregando..." : "Criar conta de pagamento"}
      </Button>
    </div>
  );
}
