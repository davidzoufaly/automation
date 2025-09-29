#!/usr/bin/env node

import { writeOutput } from "../utils/index.js";

async function getTeamMembers(orgName, teamName, githubToken) {
  try {
    const response = await fetch(`https://api.github.com/orgs/${orgName}/teams/${teamName}/members`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch team members: ${response.statusText}`);
      return null;
    }

    const members = await response.json();
    return members.map((member) => member.login);
  } catch (error) {
    console.error("❌ Error fetching team members:", error.message);
    return null;
  }
}

function processCodeowner(codeowner) {
  // Remove @ prefix if present
  const cleanCodeowner = codeowner.replace(/^@/, "");

  // Check if it's a team (contains org/team format)
  if (cleanCodeowner.includes("/")) {
    const [orgName, teamName] = cleanCodeowner.split("/");
    return { isTeam: true, orgName, teamName };
  }

  // It's individual users
  return {
    isTeam: false,
  };
}

async function processGitHubTeamMembers(codeowner, githubToken) {
  try {
    console.log("Processing CODEOWNER:", codeowner);
    const ownerInfo = processCodeowner(codeowner);

    let userList;
    if (ownerInfo.isTeam) {
      console.log(`Detected team: ${ownerInfo.teamName} in organization: ${ownerInfo.orgName}`);
      const members = await getTeamMembers(ownerInfo.orgName, ownerInfo.teamName, githubToken);

      if (members && members.length > 0) {
        userList = members.map((member) => `${member}`).join(",");
        console.log("Team members:", userList);
      } else {
        console.log(`Could not fetch team members or team is empty, using team name: ${codeowner}`);
        userList = "";
      }
    } else {
      console.log("Individual users detected:", codeowner);
      // Convert space-separated usernames to comma-separated
      userList = codeowner.trim().split(/\s+/).join(",");
      console.log("Processed user list:", userList);
    }

    writeOutput("user_info", userList);
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    process.exit(1);
  }
}

processGitHubTeamMembers(process.env.CODEOWNER, process.env.GITHUB_TOKEN);
