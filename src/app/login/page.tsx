import Typography from "@/components/shared/typography";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-16">
      <section className="space-y-2">
        <Typography as="h1" variant="heading" size="4xl">
          Sign in
        </Typography>

        <Typography className="text-muted-foreground">
          Use your email and password, or continue with Google.
        </Typography>
      </section>

      <LoginForm />
    </div>
  );
}
