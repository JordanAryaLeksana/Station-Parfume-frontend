import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field";
import { Input } from "./input";

/**
 * Field lays out one form control with its label, help text, and error.
 * The Forms guide shows it wired to React Hook Form.
 */
const meta = {
  title: "Components/Field",
  component: Field,
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-story-name">Product name</FieldLabel>
      <Input id="field-story-name" placeholder="Parfum A" />
      <FieldDescription>Shown on the product page.</FieldDescription>
    </Field>
  ),
};

/**
 * Three things mark a field as invalid: `data-invalid` on the Field,
 * `aria-invalid` on the input, and `aria-describedby` pointing at the error.
 */
export const Invalid: Story = {
  render: (args) => (
    <Field {...args} data-invalid>
      <FieldLabel htmlFor="field-story-invalid">Product name</FieldLabel>

      <Input
        id="field-story-invalid"
        defaultValue="A"
        aria-invalid
        aria-describedby="field-story-invalid-error"
      />

      <FieldError id="field-story-invalid-error">
        Name must contain at least 2 characters
      </FieldError>
    </Field>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-story-price">Price (IDR)</FieldLabel>
      <Input id="field-story-price" type="number" defaultValue={150000} />
    </Field>
  ),
};

/**
 * FieldGroup spaces the fields of a form. FieldSet and FieldLegend name a
 * group of related fields, and FieldSeparator divides the form.
 */
export const Group: Story = {
  render: () => (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Sign in</FieldLegend>

          <Field>
            <FieldLabel htmlFor="field-story-email">Email</FieldLabel>
            <Input
              id="field-story-email"
              type="email"
              placeholder="you@example.com"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="field-story-password">Password</FieldLabel>
            <Input id="field-story-password" type="password" />
          </Field>
        </FieldSet>

        <Button type="submit">Sign in</Button>

        <FieldSeparator>or</FieldSeparator>

        <Button type="button" variant="outline">
          Continue with Google
        </Button>
      </FieldGroup>
    </form>
  ),
};
