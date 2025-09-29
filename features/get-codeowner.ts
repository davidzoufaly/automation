#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { writeOutput } from "../utils/index.js";

function getDefaultOwners(codeownersContent) {
  const lines = codeownersContent.split("\n");
  const defaultLine = lines.find((line) => {
    if (!line.trim() || line.trim().startsWith("#")) {
      return false;
    }
    return line.trim().startsWith("*");
  });

  if (!defaultLine) {
    throw new Error("CODEOWNERS file is invalid. Default owners are not set.");
  }

  return defaultLine.split("*")[1].trim();
}

function getCodeOwner(codeownersPath) {
  console.log("Using CODEOWNERS path:", codeownersPath);

  const codeownersFile = join(process.cwd(), ".github/CODEOWNERS");

  // Read CODEOWNERS file or exit if it cannot be read
  let codeownersContent;
  try {
    codeownersContent = readFileSync(codeownersFile, "utf8");
  } catch (error) {
    console.error("❌ Error reading CODEOWNERS file:", error.message);
    process.exit(1);
  }

  const lines = codeownersContent.split("\n");

  // Find the line that matches the codeowners path
  const matchingLine = lines.find((line) => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith("#")) {
      return false;
    }
    return line.includes(codeownersPath);
  });

  if (matchingLine) {
    // Extract owners (everything after the path)
    const owners = matchingLine.split(codeownersPath)[1].trim();

    console.log("Found code owner:", owners);
    writeOutput("codeowner", owners);
    return;
  }

  // If no match found, use default owners
  try {
    const defaultOwners = getDefaultOwners(codeownersContent);
    console.log("No specific owners found, using default owners:", defaultOwners);
    writeOutput("codeowner", defaultOwners);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

getCodeOwner(process.env.CODEOWNERS_PATH);
