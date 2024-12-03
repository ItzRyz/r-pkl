import { hashSync, compareSync } from "bcrypt-ts";

function compare(text: string, encrypted: string): boolean {
  return compareSync(text, encrypted);
}

function encrypt(text: string): string {
  return hashSync(text, 12);
}

export { compare, encrypt };
