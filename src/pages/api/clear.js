import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const directory = process.cwd();
  const safeToDeleteExtensions = [".txt", ".json", ".log"]; // Add more as needed

  try {
    const files = await fs.readdir(directory);
    let deletedFiles = 0;
    let skippedFiles = 0;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);

      if (
        stats.isFile() &&
        safeToDeleteExtensions.includes(path.extname(file))
      ) {
        await fs.unlink(filePath);
        deletedFiles++;
      } else {
        skippedFiles++;
      }
    }

    res.status(200).json({
      message: `Operation complete. ${deletedFiles} files deleted, ${skippedFiles} files skipped.`,
      deletedFiles,
      skippedFiles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
