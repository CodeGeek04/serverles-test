import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export default async function handler(req, res) {
  const filename = path.join("/tmp", "data.txt");

  try {
    let readContent;
    try {
      readContent = await fs.readFile(filename, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        readContent = "hello";
        await fs.writeFile(filename, readContent);
      } else {
        throw error;
      }
    }

    const writeContent = crypto.randomBytes(10).toString("hex");
    await fs.writeFile(filename, writeContent);

    res.status(200).json({ read: readContent, wrote: writeContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
