#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProjectConfig {
  name: string;
  framework: 'react' | 'next' | 'vue';
  directory: string;
}

// Version information
const VERSIONS = {
  FHEVM: '0.8.0',
  RELAYER_SDK: '0.2.0',
  FHEVM_SDK: 'workspace'
};

async function displayVersions() {
  console.log(chalk.cyan('\n🔐 FHEVM Template Generator\n'));
  console.log(chalk.green(`FHEVM Version: ${VERSIONS.FHEVM}`));
  console.log(chalk.green(`Relayer SDK Version: ${VERSIONS.RELAYER_SDK}`));
  console.log(chalk.green(`FHEVM SDK Version: ${VERSIONS.FHEVM_SDK}\n`));
}

async function promptForProjectDetails(): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: 'my-zama-app',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name is required';
        }
        if (!/^[a-z0-9-_]+$/.test(input)) {
          return 'Project name should only contain lowercase letters, numbers, hyphens, and underscores';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Next.js', value: 'next' },
        { name: 'Vue.js', value: 'vue' }
      ]
    }
  ]);

  return {
    name: answers.name,
    framework: answers.framework,
    directory: path.resolve(process.cwd(), answers.name)
  };
}

async function createProject(config: ProjectConfig) {
  const spinner = ora(`Creating ${config.framework} project: ${config.name}`).start();

  try {
    // Check if directory already exists
    if (await fs.pathExists(config.directory)) {
      spinner.fail(`Directory ${config.name} already exists`);
      process.exit(1);
    }

    // Create project directory
    await fs.ensureDir(config.directory);

    // Copy template based on framework
    const templatePath = path.join(__dirname, '..', 'templates', config.framework);
    
    if (!(await fs.pathExists(templatePath))) {
      spinner.fail(`Template for ${config.framework} not found`);
      process.exit(1);
    }

    await fs.copy(templatePath, config.directory);

    // Update package.json with project name
    const packageJsonPath = path.join(config.directory, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = config.name;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    spinner.succeed(`Successfully created ${config.framework} project: ${config.name}`);

    // Display next steps
    console.log(chalk.cyan('\n📋 Next steps:'));
    console.log(chalk.white(`  cd ${config.name}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  npm run dev'));
    console.log(chalk.cyan('\n📚 Additional resources:'));
    console.log(chalk.blue('  View Zama Docs: https://docs.zama.ai/protocol/examples/'));

  } catch (error) {
    spinner.fail(`Failed to create project: ${error}`);
    process.exit(1);
  }
}

async function main() {
  const program = new Command();

  program
    .name('create-zama-app')
    .description('Create a new FHEVM application')
    .version('0.1.0');

  program
    .argument('[project-name]', 'name of the project')
    .option('-t, --template <framework>', 'framework template (react, next, vue)')
    .action(async (projectName, options) => {
      await displayVersions();

      let config: ProjectConfig;

      if (projectName && options.template) {
        // Non-interactive mode
        config = {
          name: projectName,
          framework: options.template as 'react' | 'next' | 'vue',
          directory: path.resolve(process.cwd(), projectName)
        };
      } else {
        // Interactive mode
        config = await promptForProjectDetails();
      }

      await createProject(config);
    });

  program.parse();
}

main().catch(console.error);