import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { WRITINGS_DATA } from "../src/data/contextMapData.ts";
import { BOOK_ESSAYS_BY_URL } from "../src/data/bookContentData.ts";

const root = new URL("../../", import.meta.url);
const { writings } = JSON.parse(readFileSync(new URL("agent-context.json", root), "utf8"));

test("every archive essay has consistent metadata in the reader, map and discovery index", () => {
  const urls = Object.keys(BOOK_ESSAYS_BY_URL).sort();
  for (const entries of [WRITINGS_DATA, writings]) {
    assert.deepEqual(entries.map(entry => entry.localUrl).sort(), urls);
    for (const entry of entries) {
      const source = readFileSync(new URL(entry.localMarkdownUrl.slice(1), root), "utf8");
      const title = source.split("\n")[0].replace(/^# /, "");
      assert.equal(entry.title, title, entry.localUrl);
      assert.equal(BOOK_ESSAYS_BY_URL[entry.localUrl].title, title, entry.localUrl);
    }
  }
  const dates = new Map(writings.map(entry => [entry.localUrl, entry.date]));
  for (const entry of WRITINGS_DATA) assert.equal(entry.date, dates.get(entry.localUrl), entry.localUrl);
});
