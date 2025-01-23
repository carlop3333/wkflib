import { assertEquals } from "@std/assert/equals";
import { assertIsError } from "@std/assert/is-error";
import { Buffer } from "@std/io/buffer";
import { join } from "@std/path";
import { convertXML } from "../converter.ts";
import { bufToUint8 } from "../utils.ts";

Deno.test("convertXML - XML conversion with WF dump", () => {
  const xml = Deno.openSync(join(import.meta.dirname!, "testfiles/wikidump.xml"));

  // Read the file then create an Buffer
  const result = convertXML(new Buffer(bufToUint8(xml)));
  console.log(">got result...");

  // Read the result then decode it as an input
  const res = bufToUint8(result);

  //Read expected output then assert them
  console.log(">opening functions.json");
  const expectedOut = Deno.openSync(join(import.meta.dirname!, "testfiles/functions.json"));
  const outarr = bufToUint8(expectedOut);

  //noleak
  expectedOut.close();
  xml.close();

  assertEquals(res, outarr);
});

//* Should throw SyntaxError
Deno.test("convertXML - nothingburger", () => {
  //* garbo XML
  const xml = `<mediawiki>
  <page>
    <title>Z1</title>
    <ns>0</ns>
    <id>3</id>
    <revision>
      <id>149790</id>
      <parentid>149789</parentid>
      <timestamp>2024-12-26T19:04:26Z</timestamp>
      <contributor>
        <username>Amire80</username>
        <id>113</id>
      </contributor>
      <origin>149790</origin>
      <model>zobject</model>
      <format>text/plain</format>
      <text bytes="17636" sha1="ph6rnx08bmgk08njdu5vx4rhxh3un0u" xml:space="preserve"></text>
      <sha1>ph6rnx08bmgk08njdu5vx4rhxh3un0u</sha1>
    </revision>
  </page>
  <page>
    <title>Z2</title>
    <ns>0</ns>
    <id>3</id>
    <revision>
      <id>149790</id>
      <parentid>149789</parentid>
      <timestamp>2024-12-26T19:04:26Z</timestamp>
      <contributor>
        <username>Amire80</username>
        <id>113</id>
      </contributor>
      <origin>149790</origin>
      <model>zobject</model>
      <format>text/plain</format>
      <text bytes="17636" sha1="ph6rnx08bmgk08njdu5vx4rhxh3un0u" xml:space="preserve"></text>
      <sha1>ph6rnx08bmgk08njdu5vx4rhxh3un0u</sha1>
    </revision>
  </page>
  `;
  try {
    convertXML(new Buffer(new TextEncoder().encode(xml)));
  } catch (e) {
    assertIsError(e, SyntaxError);
  }
});
