#!/usr/bin/env node
import { PR_TYPES } from "../constants/index.ts";
import { writeOutput } from "../utils/index.js";

function extractPRType(message) {
  if (!message) {
    console.error("❌ No Message provided");
    process.exit(1);
  }

  // Match the conventional commit format
  const typeRegex = new RegExp(`^(${PR_TYPES.join("|")})(?:\\([^)]*\\))?:`, "i");
  const match = message.match(typeRegex);

  if (!match) {
    console.log("⚠️ No PR type found in commit message, defaulting to 'chore'");
    writeOutput("pr_type", "chore");
    return;
  }

  const prType = match[1].toLowerCase();

  console.log("✅ Found PR type:", prType);
  writeOutput("pr_type", prType);
}

extractPRType(process.env.GIT_COMMIT_MESSAGE);
