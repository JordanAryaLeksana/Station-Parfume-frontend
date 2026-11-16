import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// The live example of the Forms guide (forms.mdx). Submitting shows the
// values. A real form calls a mutation instead, as in
// src/features/auth/login-form.tsx.
const productSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  price: z.number().int().positive("Price must be greater than 0"),
});

type ProductInput = z.infer<typeof productSchema>;

function ProductForm() {
  const [submitted, setSubmitted] = useState<ProductInput | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 150000,
    },
  });

  return (
    <div className="w-80 space-y-4">
      <form noValidate onSubmit={handleSubmit(setSubmitted)}>
        <FieldGroup>
          {/* Name */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="product-name">Product Name</FieldLabel>

            <Input
              id="product-name"
              type="text"
              placeholder="Parfum A"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "product-name-error" : undefined}
              {...register("name")}
            />

            {errors.name && (
              <FieldError id="product-name-error">
                {errors.name.message}
              </FieldError>
            )}
          </Field>

          {/* Price */}
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="product-price">Price (IDR)</FieldLabel>

            <Input
              id="product-price"
              type="number"
              min={1}
              step={1}
              aria-invalid={!!errors.price}
              aria-describedby={
                errors.price ? "product-price-error" : undefined
              }
              {...register("price", { valueAsNumber: true })}
            />

            {errors.price && (
              <FieldError id="product-price-error">
                {errors.price.message}
              </FieldError>
            )}
          </Field>

          <Button type="submit">Add Product</Button>
        </FieldGroup>
      </form>

      {/* Submitted Values */}
      {submitted && (
        <pre
          role="status"
          className="overflow-x-auto rounded-md bg-muted p-3 text-xs"
        >
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  );
}

const meta = {
  title: "Guides/Forms",
  component: ProductForm,
  // forms.mdx is the Docs page of these stories.
  tags: ["!autodocs"],
} satisfies Meta<typeof ProductForm>;

export default meta;

export const Example: StoryObj<typeof meta> = {};
