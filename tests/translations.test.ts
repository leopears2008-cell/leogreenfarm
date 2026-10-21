import { test } from "node:test";
import assert from "node:assert/strict";
import { translations } from "../src/translations.ts";

test("en, ta, hi translation keys are in sync", () => {
  const en = Object.keys(translations.en).sort();
  for (const lang of ["ta", "hi"] as const) {
    const keys = Object.keys(translations[lang]).sort();
    assert.deepEqual(en.filter((k) => !keys.includes(k)), [], `${lang} is missing keys`);
    assert.deepEqual(keys.filter((k) => !en.includes(k)), [], `${lang} has extra keys`);
  }
});
