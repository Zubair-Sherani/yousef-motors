"use client";

import { useRef, useState, type FormEvent } from "react";

import { isFormConfigured, submitVehicleInquiry } from "@/lib/forms";
import { vehicleTitle } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

const SUCCESS_MESSAGE = "Thank you! Your inquiry has been sent. We'll get back to you soon.";
const FAILURE_MESSAGE = "Sorry, we couldn't send your inquiry. Please try again.";

export function VehicleInquiryForm({ vehicle }: { vehicle: Vehicle }) {
  const title = vehicleTitle(vehicle);
  const startedAtRef = useRef("");
  const configured = isFormConfigured();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`I am interested in the ${title}.`);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  function markStarted() {
    if (!startedAtRef.current) {
      startedAtRef.current = String(Date.now());
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitVehicleInquiry(
      {
        name,
        email,
        phone,
        message,
        company: String(formData.get("company") ?? ""),
        botcheck: String(formData.get("botcheck") ?? ""),
        startedAt: startedAtRef.current,
      },
      vehicle,
    );

    if (result.ok) {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setStatus("success");
      setFeedback(SUCCESS_MESSAGE);
      return;
    }

    setStatus("error");
    setFeedback(result.error ?? FAILURE_MESSAGE);
  }

  return (
    <form
      className="border border-line bg-paper p-6"
      onFocus={markStarted}
      onChange={markStarted}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <h2 className="font-serif text-2xl">Interested in this vehicle?</h2>
      <p className="mt-2 text-sm text-muted">Inquiry for {title}</p>

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
            value={name}
            onChange={(event) => setName(event.target.value)}
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Message</span>
          <textarea
            required
            name="message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="border border-line bg-paper px-3 py-2"
          />
        </label>
      </div>

      {!configured ? (
        <p className="mt-4 text-sm text-muted">
          The inquiry form is not configured yet. Add
          {" "}
          <code>NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY</code>
          {" "}
          to send messages.
        </p>
      ) : null}

      {feedback ? (
        <p
          className={`mt-4 text-sm ${status === "success" ? "text-ink" : "text-red-800"}`}
          role={status === "success" ? "status" : "alert"}
        >
          {feedback}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 bg-ink px-5 py-2.5 text-sm text-paper disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
