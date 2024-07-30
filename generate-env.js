#!/usr/bin/env node
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");

// Function to read and parse the environment file
const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "" && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [key, ...values] = line.split("=");
      acc[key.trim()] = values.join("=").trim().replace(/^"|"$/g, ""); // Remove surrounding quotes if present
      return acc;
    }, {});
};

// Read the test.env file
const testEnv = parseEnvFile("test.env");
const env = parseEnvFile(".env");

const command = process.argv[2];
const secondArg = process.argv[3];

//create env file if not exists
if (!fs.existsSync(".env")) {
  fs.writeFileSync(".env", "");
  console.log(chalk.green(".env file created successfully!"));
}

if (!fs.existsSync("test.env")) {
  fs.writeFileSync("test.env", "");
  console.log(chalk.green("test.env file created successfully!"));
}

if (command === "generate") {
  const envKeys = Object.keys(testEnv);

  let keysToPrompt;
  if (secondArg === "--missing") {
    keysToPrompt = envKeys.filter((key) => !(key in env));
  } else {
    keysToPrompt = envKeys;
  }

  if (keysToPrompt.length === 0) {
    console.log(chalk.green("All keys are already set in the .env file."));
    process.exit(0);
  }

  const questions = keysToPrompt.map((key) => ({
    type: "input",
    name: key,
    message: chalk.blue(`Enter value for ${key}:`),
    default: env[key] || "",
  }));

  inquirer.prompt(questions).then((answers) => {
    const envContent = Object.assign({}, env, answers);
    const envFileContent = Object.entries(envContent)
      .map(([key, value]) => `${key}="${value}"`)
      .join("\n");

    // Write the .env file
    fs.writeFileSync(".env", envFileContent);

    console.log(chalk.green(".env file generated successfully!"));
  });
} else if (command === "check") {
  const missingKeys = Object.keys(testEnv).filter((key) => !(key in env));

  if (missingKeys.length > 0) {
    console.log(chalk.red("The following keys are missing in the .env file:"));
    missingKeys.forEach((key) => console.log(chalk.yellow(key)));
  } else {
    console.log(chalk.green("All keys from test.env are set in .env."));
  }
} else {
  console.log(
    chalk.red(
      'Invalid command. Use "generate" to create .env or "check" to verify missing keys.'
    )
  );
}
