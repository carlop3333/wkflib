import { Buffer } from "@std/io/buffer";
import { bufToUint8 } from "./utils.ts";

interface MultilingualBase {
  [name: string]: unknown;
}
//* assume both Z32 and Z12 have the same struct
interface LangType {
  type: string;
  language: string;
  nativeString: string | Array<string>;
}
type ZObject = {
  type: string;
  label: string;
  aliases: string;
  description: string;
  canonical_value: string;
};

export class Labelizer {
  /**
   * Semi labelized dump.
   */
  // deno-lint-ignore no-explicit-any
  private zobjects: any;

  /**
   * Creates a dump semi labelizer.
   *
   * @param {Buffer} ZObjects The dumped ZObjects
   * @param {string} ZLanguage The ZLanguage you want the function to be in. By default is English = Z1002
   */
  constructor(zObjects: Buffer, zLanguage: string) {
    this.zobjects = JSON.parse(new TextDecoder().decode(bufToUint8(zObjects)));
    this.#semiLabelize(zLanguage);
  }

  /**
   * Gets the (semi)labelized dump.
   * @returns a JSON with all objects. Only labelized: type, label, aliases, and description (if they exist!) in said ZLang
   */
  getAllObjects() {
    return this.zobjects;
  }

  /**
   * Lists ALL of the objects in a wikidump.
   * @argument specific_type Lists ALL Objects of an specific type. Useful for getting things like types (heh), functions, and languages.
   * @returns a JSON with all types. in order of canonical to labelized.
   */
  listAllObjects(specific_type: string | undefined = undefined) {
    //? Maybe something like {{add_unimpled_funcs: boolean, add_untested_funcs: boolean}}?
    const ret: Record<string, string> = {};
    for (const z in this.zobjects) {
      const obj = this.zobjects[z] as ZObject;
      // In other words, checks for a specific type, else everything goes in
      if (specific_type !== undefined && obj.type == specific_type) ret[z] = obj.label;
      else if (specific_type === undefined) ret[z] = obj.label;
    }
    return ret;
  }

  /**
   * Labelizes only: type, label, aliases, and description (if they exist!) in said ZLang
   */
  #semiLabelize(zlang: string) {
    const semiZObjs: Record<string, MultilingualBase> = {};

    //* Works for both Z12/Z11 as well as Z32/Z31
    function searchMultilingualSet(setsOrTexts: MultilingualBase, zLanguage: string) {
      //Replaces ZX to just LangType
      function replaceZP(z: unknown) {
        if (typeof z == "object" && z !== null && Object.hasOwn(z, "Z1K1")) {
          const almost = z as Record<string, string>; // {*, *, *}
          return almost["Z1K1"] == "Z31"
            ? ({ type: almost["Z1K1"], language: almost["Z31K1"], nativeString: almost["Z31K2"] } as LangType)
            : ({
                type: almost["Z1K1"],
                language: almost["Z11K1"],
                nativeString: almost["Z11K2"],
              } as LangType);
        } //Not throw because sometimes things arent sets
      }

      //* declare some vars
      try {
        const isSet = setsOrTexts.Z1K1 == "Z32";
        const base = (isSet ? setsOrTexts["Z32K1"] : setsOrTexts["Z12K1"]) as Array<MultilingualBase>; // [{*, *, *}, ...]

        for (let i = 1; i <= base.length; i++) {
          const chain: LangType | undefined = replaceZP(base[i]); // {*, *, *}
          //typescript gore
          if (chain?.language == zLanguage)
            return isSet ? (chain.nativeString.slice(1) as string[]) : (chain.nativeString as string);
        }
      } catch {
        return undefined;
      }
    }

    //doesnt try-catch, would be useless anyway
    //TODO: This should be natural language-agnostic, should get types of Z2 first
    for (const zid in this.zobjects) {
      const tType = typeof this.zobjects[zid]["Z2K2"];
      //gore typescript, again i can't do it directly for some reason
      const type =
        tType == "object"
          ? this.zobjects[zid]["Z2K2"]["Z1K1"] //if nested obj
          : tType == "string"
          ? "Z6" // if string
          : "Z1002"; // if an array or anything else
      const label = searchMultilingualSet(this.zobjects[zid]["Z2K3"], zlang);
      const aliases = searchMultilingualSet(this.zobjects[zid]["Z2K4"], zlang);
      const description = searchMultilingualSet(this.zobjects[zid]["Z2K5"], zlang);
      const canonical_value = this.zobjects[zid]["Z2K2"];
      semiZObjs[zid] = { type, label, aliases, description, canonical_value };
    }

    this.zobjects = semiZObjs;
  }
}
