import { OAuthCallback } from "@/features/auth/oauth-callback";

// The backend redirects here after an OAuth login.
export default function OAuthSuccessPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <OAuthCallback />
    </div>
  );
}
