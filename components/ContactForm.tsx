"use client";

import { useRef, useState } from "react";

import { isFormConfigured, submitContactForm } from "@/lib/forms";

export function ContactForm({
  heading = "Send a message",
  submitLabel = "Send message",
}: {
  heading?: string;
  submitLabel?: string;
}) {
  const startedAtRef = useRef("");
  const configured = isFormConfigured();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function markStarted() {
    if (!startedAtRef.current) {
      startedAtRef.current = String(Date.now());
    }
  }

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setError(null);

    const result = await submitContactForm({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
      botcheck: String(formData.get("botcheck") ?? ""),
      startedAt: startedAtRef.current,
    });

    if (result.ok) {
      setStatus("success");
      return;
    }

    setStatus("error");
    setError(result.error ?? "Sorry, we couldn't send your inquiry. Please try again.");
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-stone p-6" role="status">
        <h2 className="font-serif text-2xl">{heading}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          Thank you! Your inquiry has been sent. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      className="border border-line bg-paper p-6"
      onFocus={markStarted}
      onChange={markStarted}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(new FormData(event.currentTarget));
      }}
    >
      <h2 className="font-serif text-2xl">{heading}</h2>

      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          <span>Name</span>
          <input
            required
            name="name"
            autoComplete="name"
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Message</span>
          <textarea
            required
            name="message"
            rows={5}
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
      </div>

      {!configured ? (
        <p className="mt-4 text-sm text-muted">
          The form is not configured yet. Add
          {" "}
          <code>NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY</code>
          {" "}
          to send messages.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 bg-ink px-5 py-2.5 text-sm text-paper disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
