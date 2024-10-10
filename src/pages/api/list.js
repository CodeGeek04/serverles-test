import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const directory = process.cwd();
  try {
    const files = await fs.readdir(directory);
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
