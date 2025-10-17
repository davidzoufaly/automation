import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { UserConfig } from "../types";

/**
 * Reads and parses the configuration file from the given path
 * @param configFilePath Path to the configuration file relative to the workspace
 * @returns The parsed configuration object or null if file cannot be read
 */
export async function readConfigFile(): Promise<UserConfig | null> {
  const configFilePath = core.getInput("config-file-path");

  try {
    // Get the workspace directory (where the repository is checked out)
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
    const absolutePath = path.join(workspace, configFilePath);

    core.info(`Looking for config file at: ${absolutePath}`);

    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      core.warning(`Config file not found at ${absolutePath}`);
      return null;
    }

    // Read and parse the JSON file
    try {
      const configContent = fs.readFileSync(absolutePath, "utf8");
      const configObject = JSON.parse(configContent);
      core.info("Successfully parsed JSON config file");
      return configObject as UserConfig;
    } catch (parseError) {
      core.warning(
        `Failed to parse JSON config file: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
      );
      return null;
    }
  } catch (error) {
    core.warning(`Error reading config file: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
