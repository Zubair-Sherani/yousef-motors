import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

export function parseArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith("--")) {
      continue;
    }

    const raw = token.slice(2);
    const equalsIndex = raw.indexOf("=");
    if (equalsIndex > 0) {
      result[raw.slice(0, equalsIndex)] = raw.slice(equalsIndex + 1);
      continue;
    }

    const key = raw;
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = "true";
      continue;
    }

    result[key] = next;
    index += 1;
  }

  return result;
}

export async function createPrompter(prefill: Record<string, string> = {}) {
  const rl = stdin.isTTY ? readline.createInterface({ input: stdin, output: stdout }) : null;

  async function ask(label: string, options?: { defaultValue?: string; required?: boolean }) {
    const argKey = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .replace(/color$/, "");
    const mapped = mapLabelToArg(label);

    if (prefill[mapped] !== undefined) {
      return prefill[mapped] ?? "";
    }
    if (prefill[argKey] !== undefined) {
      return prefill[argKey] ?? "";
    }

    if (!rl) {
      if (options?.defaultValue !== undefined) {
        return options.defaultValue;
      }
      if (options?.required === false) {
        return "";
      }
      throw new Error(`Missing required argument --${mapped}`);
    }

    const suffix = options?.defaultValue ? ` [${options.defaultValue}]` : "";
    const answer = (await rl.question(`${label}${suffix}: `)).trim();

    if (!answer && options?.defaultValue !== undefined) {
      return options.defaultValue;
    }
    if (!answer && options?.required !== false) {
      console.log("This field is required.");
      return ask(label, options);
    }
    return answer;
  }

  return {
    ask,
    close: () => rl?.close(),
  };
}

function mapLabelToArg(label: string): string {
  const map: Record<string, string> = {
    Year: "year",
    Make: "make",
    Model: "model",
    Trim: "trim",
    Price: "price",
    Mileage: "mileage",
    VIN: "vin",
    Engine: "engine",
    Transmission: "transmission",
    Drivetrain: "drivetrain",
    "Exterior Color": "exterior",
    "Interior Color": "interior",
    Featured: "featured",
    "Image folder": "images",
    Description: "description",
    Status: "status",
    "Vehicle ID or slug": "id",
  };

  return map[label] ?? label.toLowerCase();
}
