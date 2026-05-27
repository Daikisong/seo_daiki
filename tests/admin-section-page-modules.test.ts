import assert from "node:assert/strict";
import AdminSectionPage, { generateStaticParams } from "../apps/web/app/admin/[section]/page";
import { AdminSectionPageShell } from "../apps/web/app/admin/[section]/AdminSectionPageShell";
import { AdminTable } from "../apps/web/app/admin/[section]/AdminSectionTable";

assert.equal(typeof AdminSectionPage, "function");
assert.equal(typeof AdminSectionPageShell, "function");
assert.equal(typeof AdminTable, "function");
assert.equal(generateStaticParams().some((param) => param.section === "products"), true);
assert.equal(generateStaticParams().some((param) => param.section === "search-console"), true);

console.log("Admin section page module tests passed");
