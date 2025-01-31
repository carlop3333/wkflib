import { Labelizer } from "../parser.ts";
import { join } from "@std/path";
import { assertEquals } from "@std/assert";

const readableToUint8 = async (buf: Deno.FsFile): Promise<Uint8Array> => {
  const arr = new Uint8Array(buf.statSync().size)
  await buf.read(arr);
  return arr;
}

//open og dump
const file = Deno.openSync(join(import.meta.dirname!, "testfiles/functions.json"));
const buf = await readableToUint8(file);
const decoder = new TextDecoder();



Deno.test("Labelize - semiLabelize only", async () => {
  const labelizer = new Labelizer(buf, "Z1002");

  //open semi labelized dump
  const wkdump = Deno.openSync(join(import.meta.dirname!, "testfiles/wikidump.json"));
  const dec = decoder.decode(await readableToUint8(wkdump));

  wkdump.close();

  assertEquals(JSON.stringify(labelizer.getAllObjects()), dec);
});

Deno.test("Labelize - ZObjects list", async () => {
  const labelizer = new Labelizer(buf, "Z1002");

  //open list
  const list = Deno.openSync(join(import.meta.dirname!, "testfiles/list.json"));
  const dec = decoder.decode(await readableToUint8(list));

  list.close();

  assertEquals(JSON.stringify(labelizer.listAllObjects()), dec);
});

Deno.test("Labelize - Types list", () => {
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

  assertEquals(JSON.stringify(typelist), JSON.stringify(labelizer.listAllObjects("Z4")));
});
