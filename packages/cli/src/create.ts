import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk'
import validateProjectName from 'validate-npm-package-name'
import { IObj } from './index'
import CreateReactApp from './CreateReactApp'
import { error, exit, clearConsole } from './utils'

async function create(projectName: string, options: IObj<string>) {
  if (!projectName) {
    error(chalk.red('Error: The project name must be entered'))
    exit(1)
  }

  const cwd = process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName)

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    error(chalk.red(`Invalid project name: "${name}"`))
    result.errors &&
      result.errors.forEach((err) => {
        error(chalk.red.dim('Error: ' + err))
      })
    result.warnings &&
      result.warnings.forEach((warn) => {
        error(chalk.red.dim('Warning: ' + warn))
      })
    exit(1)
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      clearConsole()
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`,
          },
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(
              targetDir
            )} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Cancel', value: false },
            ],
          },
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  const creator = new CreateReactApp(name, targetDir)
  creator.create()
}

export default (projectName: string, options: IObj<string>) => {
  return create(projectName, options).catch((err) => {
    error(err)
  })
}
