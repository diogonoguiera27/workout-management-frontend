"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export function ProfileLogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    const { error } = await authClient.signOut();

    if (error) {
      setIsSigningOut(false);
      return;
    }

    router.replace("/auth");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="h-auto gap-2 rounded-full px-4 py-2 font-heading text-base leading-none font-semibold text-profile-danger opacity-100 hover:bg-transparent hover:text-profile-danger/90 disabled:opacity-100 disabled:text-profile-danger"
      style={{ color: "var(--profile-danger)" }}
    >
      Sair da conta
      <Image
        src="/profile/profile-icon-logout.svg"
        alt=""
        width={16}
        height={16}
        aria-hidden
      />
    </Button>
  );
}
