import Link from "next/link";

import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";

// Starter index. Replace it when the project starts (see the new-project skill).
export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-6 py-16">
      <section className="space-y-3">
        <Typography as="h1" variant="heading" size="5xl">
          Next.js Boilerplate
        </Typography>

        <Typography size="lg" className="max-w-xl text-muted-foreground">
          A starting point with data fetching, forms, client state, and sign in
          already wired up.
        </Typography>
      </section>

      {/* Sign In */}
      <section className="space-y-3">
        <Typography as="h2" variant="heading" size="xl">
          Sign in
        </Typography>

        <Typography size="sm" className="text-muted-foreground">
          Needs a backend. Set NEXT_PUBLIC_API_BASE_URL first.
        </Typography>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>

          {/* Not prefetched: without a session this path redirects. */}
          <Button asChild variant="outline">
            <Link href="/dashboard" prefetch={false}>
              Dashboard (needs a session)
            </Link>
          </Button>
        </div>
      </section>

      {/* Guide */}
      <section className="space-y-3">
        <Typography as="h2" variant="heading" size="xl">
          Guide
        </Typography>

        <Typography size="sm" className="text-muted-foreground">
          How to use the components, build a form, fetch data, and share client
          state is in Storybook. Start it with npm run storybook.
        </Typography>
      </section>
    </div>
  );
}
