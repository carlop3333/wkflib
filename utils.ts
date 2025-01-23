import { Buffer } from "@std/io/buffer";

export const bufToUint8 = (buf: Buffer | Deno.FsFile): Uint8Array => {
  if (buf instanceof Buffer) {
      const arr = new Uint8Array(buf.length);
      buf.readSync(arr);
      return arr;
  } else {
      const arr = new Uint8Array(buf.statSync().size);
      buf.readSync(arr);
      return arr;
  }
}