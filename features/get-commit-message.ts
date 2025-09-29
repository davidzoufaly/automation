#!/usr/bin/env node

import { execSync } from "child_process";
import { writeOutput } from "../utils/index.js";

function getCommitMessage(prHeadSha) {
  try {
    const commitMessage = execSync(`git log -1 --pretty=%B ${prHeadSha}`, {
      encoding: "utf8",
    })
      .replace(/\n/g, " ")
      .trim();
    console.log("Commit message:", commitMessage);

    writeOutput("message", commitMessage);
  } catch (error) {
    console.error("❌ Error getting commit message:", error.message);
    process.exit(1);
  }
}

getCommitMessage(process.env.PR_HEAD_SHA);
