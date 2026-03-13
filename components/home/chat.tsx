"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Play, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Streamdown } from "streamdown";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const suggestedMessages = ["Monte meu plano de treino"];
const chatMessageSchema = z.object({
  message: z.string(),
});

const onboardingBootstrapMessage = "Quero começar a melhorar minha saude?";

type ChatProps = {
  mode?: "overlay" | "page" | "onboarding";
};

export const chatQueryStateParsers = {
  chat_open: parseAsBoolean.withDefault(false),
  chat_initial_message: parseAsString,
};

function extractFirstUrl(text: string) {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  return urlMatch?.[0] ?? null;
}

export function Chat({ mode = "overlay" }: ChatProps) {
  const [queryState, setQueryState] = useQueryStates(chatQueryStateParsers);
  const lastAutoSentMessageRef = useRef<string | null>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });
  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const isChatOpen = mode === "overlay" ? queryState.chat_open : true;
  const initialMessage = queryState.chat_initial_message;
  const isWaitingForResponse = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;
  const isOnboardingMode = mode === "onboarding";
  const inputValue = useWatch({
    control: form.control,
    name: "message",
    defaultValue: "",
  });

  const placeholder = useMemo(() => {
    if (isWaitingForResponse) {
      return "Pensando...";
    }

    return "Pergunte ao FIT.AI";
  }, [isWaitingForResponse]);

  const visibleMessages = messages.filter((message) =>
    message.parts.some(
      (part) => part.type === "text" || part.type === "reasoning"
    )
  );

  useEffect(() => {
    if (!isChatOpen) {
      lastAutoSentMessageRef.current = null;
      return;
    }

    const messageToAutoSend =
      initialMessage ?? (isOnboardingMode ? onboardingBootstrapMessage : null);

    if (!messageToAutoSend || hasMessages || status !== "ready") {
      return;
    }

    if (lastAutoSentMessageRef.current === messageToAutoSend) {
      return;
    }

    lastAutoSentMessageRef.current = messageToAutoSend;
    void sendMessage({ text: messageToAutoSend });
  }, [hasMessages, initialMessage, isChatOpen, isOnboardingMode, sendMessage, status]);

  const closeChat = () => {
    if (mode !== "overlay") {
      return;
    }

    void setQueryState({
      chat_open: false,
      chat_initial_message: null,
    });
  };

  const submitMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || status !== "ready") {
      return;
    }

    form.reset();
    await sendMessage({ text: trimmedMessage });
  };

  return (
    <div
      className={cn(
        mode === "overlay"
          ? "pointer-events-none fixed inset-0 z-[60] flex justify-center transition-opacity duration-200"
          : "flex w-full flex-1",
        isChatOpen ? "opacity-100" : "opacity-0"
      )}
      aria-hidden={mode === "overlay" ? !isChatOpen : undefined}
    >
      {mode === "overlay" ? (
        <div
          className={cn(
            "absolute inset-0 bg-foreground/20 transition-opacity duration-200",
            isChatOpen ? "pointer-events-auto opacity-100" : "opacity-0"
          )}
          onClick={closeChat}
        />
      ) : null}

      <section
        className={cn(
          mode === "overlay"
            ? "pointer-events-auto absolute inset-x-4 top-40 bottom-4 mx-auto flex w-auto max-w-[393px] flex-col overflow-hidden rounded-[20px] border border-border bg-background shadow-2xl transition-transform duration-200"
            : isOnboardingMode
              ? "flex h-[801px] w-full flex-1 flex-col bg-background"
              : "flex w-full flex-1 flex-col overflow-hidden rounded-[20px] border border-border bg-background",
          mode === "overlay"
            ? isChatOpen
              ? "translate-y-0"
              : "translate-y-full"
            : ""
        )}
        aria-label="Chat FIT.AI"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-[42px] items-center justify-center rounded-full border border-primary/8 bg-primary/8 text-primary">
              <Sparkles className="size-[18px]" />
            </div>

            <div className="flex flex-col">
              <span className="font-heading text-base leading-none font-semibold text-foreground">
                Coach AI
              </span>
              <span className="flex items-center gap-1 font-heading text-xs leading-none text-primary">
                <span className="size-2 rounded-full bg-online" />
                Online
              </span>
            </div>
          </div>

          {isOnboardingMode ? (
            <Button
              asChild
              className="h-9 rounded-full px-4 font-heading text-sm font-semibold"
            >
              <Link href="/">Acessar FIT.AI</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full p-0"
              aria-label="Fechar chatbot"
              onClick={closeChat}
            >
              <X className="size-6 text-muted-foreground" />
            </Button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {hasMessages ? (
            <div className="flex flex-col gap-3 py-5">
              {visibleMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "px-5",
                    message.role === "user" ? "pl-[60px]" : "pr-[60px]"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl px-3 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type !== "text" && part.type !== "reasoning") {
                        return null;
                      }

                      const previewUrl =
                        message.role === "assistant"
                          ? extractFirstUrl(part.text)
                          : null;

                      return (
                        <div
                          key={`${message.id}-${index}`}
                          className="flex flex-col gap-2.5"
                        >
                          <Streamdown
                            className={cn(
                              "text-sm [&_a]:text-inherit [&_a]:underline [&_ol]:pl-5 [&_p]:m-0 [&_p:not(:first-child)]:mt-4 [&_ul]:pl-5",
                              message.role === "user"
                                ? "font-heading leading-[1.4] text-primary-foreground"
                                : "font-chat leading-[1.4] text-foreground"
                            )}
                          >
                            {part.text}
                          </Streamdown>

                          {previewUrl ? (
                            <Link
                              href={previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="relative block h-[140px] overflow-hidden rounded-xl"
                            >
                              <Image
                                src="/onboarding/chat-video-thumbnail.png"
                                alt="Miniatura do video recomendado pelo FIT.AI"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-foreground/20" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-10 w-[56.89px] items-center justify-center rounded-xl bg-background/90">
                                  <Play className="size-4 fill-destructive text-destructive" />
                                </div>
                              </div>
                            </Link>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {isWaitingForResponse ? (
                <div className="px-5 pr-[60px]">
                  <div className="rounded-xl bg-secondary px-3 py-3 font-chat text-sm leading-[1.4] text-muted-foreground">
                    FIT.AI esta respondendo...
                  </div>
                </div>
              ) : null}
            </div>
          ) : isOnboardingMode ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col gap-3 py-5">
                {isWaitingForResponse ? (
                  <div className="px-5 pr-[60px]">
                    <div className="rounded-xl bg-secondary px-3 py-3 font-heading text-sm leading-[1.4] text-muted-foreground">
                      FIT.AI esta respondendo...
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end px-5 pb-5 pl-[60px]">
                <Button
                  type="button"
                  className="h-auto rounded-xl px-3 py-3 font-heading text-sm leading-[1.4] font-normal text-primary-foreground"
                  onClick={() => {
                    void submitMessage("Começar!");
                  }}
                >
                  Começar!
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-end pb-[118px]">
              <div className="flex flex-wrap gap-2 px-5">
                {suggestedMessages.map((message) => (
                  <Button
                    key={message}
                    type="button"
                    variant="ghost"
                    className="h-auto rounded-full bg-chat-suggestion px-4 py-2 font-heading text-sm leading-none font-normal text-chat-suggestion-foreground hover:bg-chat-suggestion"
                    onClick={() => {
                      void submitMessage(message);
                    }}
                  >
                    {message}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Form {...form}>
          <form
            className="border-t border-border px-5 py-5"
            onSubmit={form.handleSubmit(async ({ message }) => {
              await submitMessage(message);
            })}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          placeholder === "Pergunte ao FIT.AI"
                            ? "Digite sua mensagem"
                            : placeholder
                        }
                        className="h-[46px] rounded-full border-input bg-secondary px-4 font-heading text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                        disabled={status !== "ready"}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      size="icon-sm"
                      className="size-[42px] rounded-full"
                      disabled={!inputValue.trim() || status !== "ready"}
                      aria-label="Enviar mensagem"
                    >
                      <ArrowUp className="size-5" />
                    </Button>
                  </div>
                  <FormMessage className="px-4" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </section>
    </div>
  );
}
