import test from "node:test";
import fs from "node:fs";
import assert from "node:assert"
import { join } from "node:path";
import { convertXML } from "../converter.ts";

test("convertXML - XML conversion with WF dump", () => {
  const xml = fs.readFileSync(join(__dirname, "testfiles/wikidump.xml"));

  const result = convertXML(
    new Uint8Array(xml.buffer.slice(xml.byteOffset, xml.byteOffset + xml.buffer.byteLength))
  );
  console.log(">got result...");

  console.log(">opening functions.json");
  const expout = fs.readFileSync(join(__dirname, "testfiles/functions.json"));
  const outarr = new Uint8Array(expout.buffer.slice(expout.byteOffset, expout.byteOffset + expout.buffer.byteLength))

  assert.deepStrictEqual(result, outarr);
});


//* Should throw SyntaxError
test("convertXML - nothingburger", () => {
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
  assert.throws(() => convertXML(new TextEncoder().encode(xml)))
});
