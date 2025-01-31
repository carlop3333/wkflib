import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { join } from "node:path";
import { Labelizer } from "../parser.ts";

const file = fs.readFileSync(join(__dirname, "testfiles/functions.json"));
const buf = new Uint8Array(file.buffer.slice(file.byteOffset, file.byteOffset + file.buffer.byteLength))
const decoder = new TextDecoder()

test("Labelize - semiLabelize only", () => {
    const labelizer = new Labelizer(buf, "Z1002");
    
    const wkdump = fs.readFileSync(join(__dirname, "testfiles/wikidump.json"));

    assert.deepStrictEqual(JSON.stringify(labelizer.getAllObjects()), decoder.decode(wkdump))
})

test("Labelize - ZObjects list", () => {
    const labelizer = new Labelizer(buf, "Z1002");

    const list = fs.readFileSync(join(__dirname, "testfiles/list.json"));

    assert.deepStrictEqual(JSON.stringify(labelizer.listAllObjects()), decoder.decode(list));
})

test("Labelize - Types list", () => {
    const typelist = {
        Z1: "Object",
        Z2: "Persistent object",
        Z3: "Key",
        Z4: "Type",
        Z50: "Error type",
        Z5: "Error",
        Z6: "String",
        Z7: "Function call",
        Z8: "Function",
        Z9: "Reference",
        Z60: "Natural language",
        Z11: "Monolingual text",
        Z12: "Multilingual text",
        Z61: "Programming language",
        Z16: "Code",
        Z14: "Implementation",
        Z17: "Argument declaration",
        Z18: "Argument reference",
        Z20: "Test case",
        Z21: "Unit",
        Z22: "Evaluation result",
        Z23: "Nothing",
        Z31: "Monolingual stringset",
        Z32: "Multilingual stringset",
        Z39: "Key reference",
        Z40: "Boolean",
        Z80: "[do not use] Byte",
        Z86: "[do not use] Code point",
        Z99: "Quote",
        Z46: "Type converter to code",
        Z64: "Type converter from code",
        Z13518: "Natural number",
        Z14293: "Function option for a list of languages",
        Z14294: "Configuration of functions for given languages",
        Z89: "HTML fragment",
        Z16098: "Gregorian calendar month",
        Z16659: "Sign",
        Z16683: "Integer",
        Z16927: "Igbo calendar month",
        Z17402: "Day of the week",
        Z17813: "Gregorian era",
        Z6091: "Wikidata item reference",
        Z6092: "Wikidata property reference",
        Z6094: "Wikidata lexeme form reference",
        Z6095: "Wikidata lexeme reference",
        Z6004: "Wikidata lexeme form",
        Z6096: "Wikidata lexeme sense reference",
        Z6001: "Wikidata item",
        Z6002: "Wikidata property",
        Z6003: "Wikidata statement",
        Z6005: "Wikidata lexeme",
        Z6006: "Wikidata lexeme sense",
        Z19677: "Rational number",
        Z20159: "Gregorian year",
        Z6040: "Wikidata statement rank",
        Z20342: "Day of Roman year",
        Z20420: "Gregorian calendar date",
        Z20825: "Floating point special value",
        Z20838: "float64",
      };
      const labelizer = new Labelizer(buf, "Z1002");
    
      assert.deepStrictEqual(JSON.stringify(typelist), JSON.stringify(labelizer.listAllObjects("Z4")));
})
