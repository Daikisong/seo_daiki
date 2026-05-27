import type { ReactNode } from "react";
import { adminFieldValue } from "@/lib/admin/admin-form-utils";

export function AdminPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function QualityStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3">
      <p className="text-xs uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export function AdminTokenInput() {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Admin token</span>
      <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="adminToken" type="password" />
    </label>
  );
}

export function TextInput({
  defaultValue,
  label,
  name,
  required = false,
  type = "text"
}: {
  defaultValue?: string | number;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  const inputProps = {
    ...(required ? { required: true } : {}),
    ...(type === "number" ? { step: "any" } : {})
  };

  return (
    <label className="text-sm">
      <span className="block text-neutral-600">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
        defaultValue={adminFieldValue(defaultValue)}
        name={name}
        type={type}
        {...inputProps}
      />
    </label>
  );
}

export function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
      {label}
    </button>
  );
}
