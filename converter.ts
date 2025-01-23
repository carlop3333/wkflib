import { parse } from "@libs/xml";
import { Buffer } from "@std/io/buffer";

/**
 * Convert a WikiFunctions XML dump and extract the functions to a JSON
 * @param file - The file/buffer to convert. 
 * @returns {Buffer}
 */
export function convertXML(file: Buffer): Buffer {
  const data = parse(file);
  const rootFile = new Buffer();
  // deno-lint-ignore no-explicit-any
  const functionsList: any = {};
  console.debug(
    //@ts-ignore: Explicit
    data.mediawiki["~children"].forEach((page) => {
      if (page["~name"] == "page" && String(page.title).startsWith("Z")) {
        if (typeof page.revision.text["#text"] !== typeof String) {
          const functionID = page.title;
          //console.debug(`Saving function ${functionID}.`);
          functionsList[functionID] = JSON.parse(page.revision.text["#text"]);
        } else throw new SyntaxError("No text found on ZPage");
      }
    })
  );
  const encoded = new TextEncoder().encode(JSON.stringify(functionsList));
  const _written = rootFile.writeSync(encoded);
  //console.debug(`Written ${_written} bytes of data.`);
  return rootFile;
}

