"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && data?.session) {
      router.replace("/");
    }
  }, [data?.session, isPending, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage("");

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    if (error) {
      setErrorMessage(error.message || "Nao foi possivel iniciar o login.");
      setIsSigningIn(false);
      return;
    }

    setIsSigningIn(false);
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Carregando sessao...</p>
      </main>
    );
  }

  if (data?.session) {
    return null;
  }

  return (
    <main className="flex min-h-screen justify-center bg-background">
      <section className="relative flex min-h-screen w-full max-w-[402px] flex-col overflow-hidden">
        <Image
          src="/auth/login-background.png"
          alt="Plano de fundo da tela de login"
          fill
          className="object-cover"
          priority
        />

        <Image
          src="/auth/fit-ai-logo.svg"
          alt="Logo FIT.AI"
          width={85}
          height={38}
          className="absolute left-1/2 top-12 -translate-x-1/2"
          priority
        />

        <div className="relative mt-auto flex flex-col items-center gap-[60px] rounded-t-[20px] bg-primary px-5 pt-12 pb-10">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-col gap-3 text-center">
              <p className="font-heading text-[32px] leading-[1.05] font-semibold text-primary-foreground">
                O app que vai transformar a forma como voce treina.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="h-[38px] rounded-full bg-primary-foreground px-6 text-sm font-semibold text-foreground hover:bg-primary-foreground/90"
            >
              <Image
                src="/auth/google-icon.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden
              />
              Fazer login com o Google
            </Button>

            {errorMessage ? (
              <p className="text-center text-xs text-primary-foreground/80">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <p className="text-xs leading-[1.4] text-primary-foreground/70">
            ©2026 Copyright FIT.AI. Todos os direitos reservados
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
