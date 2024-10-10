import fs from "fs/promises";
import path from "path";

const attemptDelete = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      try {
        await fs.unlink(filePath);
        console.log(`[SECURITY RISK] Successfully deleted ${filePath}`);
      } catch (error) {
        console.log(`Unable to delete ${filePath}: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`Unable to read directory ${directory}: ${error.message}`);
  }
};

export default async function handler(req, res) {
  const directoriesToTest = [
    "/var/task",
    "/opt",
    "/etc",
    "/tmp",
    "/",
    process.cwd(),
    path.dirname(process.execPath),
    path.dirname(require.main.filename),
  ];

  const results = [];

  for (const dir of directoriesToTest) {
    console.log(`Attempting to delete files in ${dir}`);
    await attemptDelete(dir);
    results.push(`Attempted deletion in ${dir}`);
  }

  // Attempt to modify environment variables
  try {
    process.env.AWS_SECRET_ACCESS_KEY = "compromised";
    console.log("[SECURITY RISK] Successfully modified AWS_SECRET_ACCESS_KEY");
  } catch (error) {
    console.log(`Unable to modify AWS_SECRET_ACCESS_KEY: ${error.message}`);
  }

  // Attempt to read sensitive files
  const sensitiveFiles = [
    "/etc/passwd",
    "/var/task/package.json",
    "/.aws/credentials",
  ];

  for (const file of sensitiveFiles) {
    try {
      await fs.readFile(file, "utf8");
      console.log(`[SECURITY RISK] Successfully read ${file}`);
    } catch (error) {
      console.log(`Unable to read ${file}: ${error.message}`);
    }
  }

  res.status(200).json({
    message: "Penetration test complete. Check logs for details.",
    attemptedDeletions: results,
  });
}
