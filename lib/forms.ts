import { absoluteUrl } from "@/data/dealership";
import { formatMileage, formatPrice, vehicleTitle } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
  botcheck: string;
  startedAt: string;
}

export interface FormResult {
  ok: boolean;
  error?: string;
}

const MIN_ELAPSED_MS = 2500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function getWeb3FormsAccessKey(): string {
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? "";
}

export function getFormEndpoint(): string {
  return process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() || WEB3FORMS_ENDPOINT;
}

export function isFormConfigured(): boolean {
  const endpoint = getFormEndpoint();
  if (endpoint.includes("web3forms.com")) {
    return getWeb3FormsAccessKey().length > 0;
  }
  return endpoint.length > 0;
}

export function validateInquiryFields(values: Pick<ContactFormValues, "name" | "email" | "phone" | "message">): string | null {
  if (!values.name.trim()) {
    return "Please enter your name.";
  }
  if (!values.email.trim()) {
    return "Please enter your email address.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    return "Please enter a valid email address.";
  }
  const phoneError = validatePhone(values.phone);
  if (phoneError) {
    return phoneError;
  }
  if (!values.message.trim()) {
    return "Please enter a message.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return "Please enter a valid phone number.";
  }
  return null;
}

function isLikelySpam(values: ContactFormValues): boolean {
  if (values.company.trim().length > 0) {
    return true;
  }
  if (values.botcheck.trim().length > 0) {
    return true;
  }

  const startedAt = Number(values.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_ELAPSED_MS) {
    return true;
  }

  return false;
}

export function vehicleInquirySubject(vehicle: Vehicle): string {
  return `New Vehicle Inquiry: ${vehicleTitle(vehicle)}`;
}

export function buildVehicleInquiryMessage(
  values: Pick<ContactFormValues, "name" | "email" | "phone" | "message">,
  vehicle: Vehicle,
): string {
  const title = vehicleTitle(vehicle);
  const phone = values.phone.trim() || "Not provided";

  return [
    "New Vehicle Inquiry",
    "",
    "Vehicle:",
    title,
    "",
    "Price:",
    formatPrice(vehicle.price),
    "",
    "Mileage:",
    formatMileage(vehicle.mileage),
    "",
    "VIN:",
    vehicle.vin,
    "",
    "Customer:",
    values.name.trim(),
    "",
    "Email:",
    values.email.trim(),
    "",
    "Phone:",
    phone,
    "",
    "Message:",
    values.message.trim(),
    "",
    "Vehicle Page:",
    absoluteUrl(`/inventory/${vehicle.slug}`),
    "",
    "Vehicle ID:",
    vehicle.id,
  ].join("\n");
}

export function buildVehicleInquiryPayload(
  values: ContactFormValues,
  vehicle: Vehicle,
): Record<string, string> {
  const title = vehicleTitle(vehicle);
  const email = values.email.trim();

  return {
    access_key: getWeb3FormsAccessKey(),
    subject: vehicleInquirySubject(vehicle),
    from_name: values.name.trim(),
    name: values.name.trim(),
    email,
    replyto: email,
    phone: values.phone.trim(),
    message: buildVehicleInquiryMessage(values, vehicle),
    botcheck: values.botcheck,
    "Vehicle Year": String(vehicle.year),
    "Vehicle Make": vehicle.make,
    "Vehicle Model": vehicle.model,
    "Vehicle Trim": vehicle.trim,
    "Vehicle Price": formatPrice(vehicle.price),
    "Vehicle Mileage": formatMileage(vehicle.mileage),
    VIN: vehicle.vin,
    "Vehicle URL": absoluteUrl(`/inventory/${vehicle.slug}`),
    "Vehicle ID": vehicle.id,
    Vehicle: title,
  };
}

export async function submitVehicleInquiry(
  values: ContactFormValues,
  vehicle: Vehicle,
): Promise<FormResult> {
  const validationError = validateInquiryFields(values);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  if (isLikelySpam(values)) {
    return { ok: true };
  }

  if (!isFormConfigured()) {
    return {
      ok: false,
      error: "Sorry, we couldn't send your inquiry. Please try again.",
    };
  }

  return postToFormProvider(buildVehicleInquiryPayload(values, vehicle));
}

export async function submitContactForm(values: ContactFormValues): Promise<FormResult> {
  const validationError = validateInquiryFields(values);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  if (isLikelySpam(values)) {
    return { ok: true };
  }

  if (!isFormConfigured()) {
    return {
      ok: false,
      error: "Sorry, we couldn't send your inquiry. Please try again.",
    };
  }

  const email = values.email.trim();
  return postToFormProvider({
    access_key: getWeb3FormsAccessKey(),
    subject: "Website contact form",
    from_name: values.name.trim(),
    name: values.name.trim(),
    email,
    replyto: email,
    phone: values.phone.trim(),
    message: values.message.trim(),
    botcheck: values.botcheck,
  });
}

async function postToFormProvider(payload: Record<string, string>): Promise<FormResult> {
  const endpoint = getFormEndpoint();
  const body: Record<string, string> = { ...payload };

  if (!endpoint.includes("web3forms.com") && !body.access_key) {
    delete body.access_key;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!response.ok || result?.success === false) {
      return {
        ok: false,
        error: "Sorry, we couldn't send your inquiry. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Sorry, we couldn't send your inquiry. Please try again.",
    };
  }
}
