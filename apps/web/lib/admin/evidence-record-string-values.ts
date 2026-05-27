export function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function required(formData: FormData, name: string) {
  const value = stringValue(formData.get(name));
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export function optional(formData: FormData, name: string) {
  return stringValue(formData.get(name)) || undefined;
}

export function listValue(formData: FormData, name: string) {
  return stringValue(formData.get(name))
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
