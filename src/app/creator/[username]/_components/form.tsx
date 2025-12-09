"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createPayment } from "../_actions/create-payment";
import { toast } from "sonner";
import { getStripeJs } from "@/lib/stripe-js";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  message: z.string().min(1, "A mensagem é obrigatória"),
  price: z.enum(["15", "25", "35"], {
    required_error: "O valor é obrigatório",
  }),
});

type FormData = z.infer<typeof formSchema>;
interface FormDonateProps {
  slug: string;
  creatorId: string;
}

export function FormDonate({ slug, creatorId }: FormDonateProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      price: "15",
    },
  });

  async function onSubmit(data: FormData) {
    const priceInCents = Number(data.price) * 100;
    const checkout = await createPayment({
      slug: slug,
      name: data.name,
      message: data.message,
      price: priceInCents,
      creatorId: creatorId,
    });

    await handlePaymentResponse(checkout);
  }

  async function handlePaymentResponse(checkout: {
    sessionId?: string;
    error?: string;
  }) {
    if (checkout.error) {
      toast.error(`Erro: ${checkout.error}`);
      return;
    }
    if (!checkout.sessionId) {
      toast.error("Erro: Falha ao criar pagamento, tente mais tarde.");
      return;
    }

    const stripe = await getStripeJs();

    if (!stripe) {
      toast.error("Erro: Falha ao criar pagamento, tente mais tarde.");
      return;
    }
    await stripe?.redirectToCheckout({ sessionId: checkout.sessionId });
    toast.success("Doação feita com sucesso!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-5 p-2 bg-white border border-gray-300 rounded-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu nome"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite sua mensagem"
                  {...field}
                  className="bg-white h-35 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da doação</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center gap-3"
                >
                  {["15", "25", "35"].map((value) => (
                    <div
                      key={value}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <RadioGroupItem value={value} id={value} />
                      <Label className="text-lg" htmlFor={value}>
                        R$ {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Carregando" : "Fazer doação"}
        </Button>
      </form>
    </Form>
  );
}
