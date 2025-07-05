import path from "path"
import { ensureRulesDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { fileExistsAtPath, isDirectory, readDirectory } from "@utils/fs"
import { formatResponse } from "@core/prompts/responses"
import fs from "fs/promises"
import { DalvikRulesToggles } from "@shared/cline-rules"
import { getGlobalState, getWorkspaceState, updateGlobalState, updateWorkspaceState } from "@core/storage/state"
import * as vscode from "vscode"
import { synchronizeRuleToggles, getRuleFilesTotalContent } from "@core/context/instructions/user-instructions/rule-helpers"

export const getGlobalClineRules = async (globalClineRulesFilePath: string, toggles: DalvikRulesToggles) => {
	if (await fileExistsAtPath(globalClineRulesFilePath)) {
		if (await isDirectory(globalClineRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(globalClineRulesFilePath)
				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, globalClineRulesFilePath, toggles)
				if (rulesFilesTotalContent) {
					const clineRulesFileInstructions = formatResponse.clineRulesGlobalDirectoryInstructions(
						globalClineRulesFilePath,
						rulesFilesTotalContent,
					)
					return clineRulesFileInstructions
				}
			} catch {
				console.error(`Failed to read .clinerules directory at ${globalClineRulesFilePath}`)
			}
		} else {
			console.error(`${globalClineRulesFilePath} is not a directory`)
			return undefined
		}
	}

	return undefined
}

export const getLocalClineRules = async (cwd: string, toggles: DalvikRulesToggles) => {
	const clineRulesFilePath = path.resolve(cwd, GlobalFileNames.clineRules)

	let clineRulesFileInstructions: string | undefined

	if (await fileExistsAtPath(clineRulesFilePath)) {
		if (await isDirectory(clineRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(clineRulesFilePath, [[".clinerules", "workflows"]])

				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, cwd, toggles)
				if (rulesFilesTotalContent) {
					clineRulesFileInstructions = formatResponse.clineRulesLocalDirectoryInstructions(cwd, rulesFilesTotalContent)
				}
			} catch {
				console.error(`Failed to read .clinerules directory at ${clineRulesFilePath}`)
			}
		} else {
			try {
				if (clineRulesFilePath in toggles && toggles[clineRulesFilePath] !== false) {
					const ruleFileContent = (await fs.readFile(clineRulesFilePath, "utf8")).trim()
					if (ruleFileContent) {
						clineRulesFileInstructions = formatResponse.clineRulesLocalFileInstructions(cwd, ruleFileContent)
					}
				}
			} catch {
				console.error(`Failed to read .clinerules file at ${clineRulesFilePath}`)
			}
		}
	}

	return clineRulesFileInstructions
}

export async function refreshClineRulesToggles(
	context: vscode.ExtensionContext,
	workingDirectory: string,
): Promise<{
	globalToggles: DalvikRulesToggles
	localToggles: DalvikRulesToggles
}> {
	// Global toggles
	const globalDalvikRulesToggles = ((await getGlobalState(context, "globalDalvikRulesToggles")) as DalvikRulesToggles) || {}
	const globalClineRulesFilePath = await ensureRulesDirectoryExists()
	const updatedGlobalToggles = await synchronizeRuleToggles(globalClineRulesFilePath, globalDalvikRulesToggles)
	await updateGlobalState(context, "globalDalvikRulesToggles", updatedGlobalToggles)

	// Local toggles
	const localDalvikRulesToggles = ((await getWorkspaceState(context, "localDalvikRulesToggles")) as DalvikRulesToggles) || {}
	const localClineRulesFilePath = path.resolve(workingDirectory, GlobalFileNames.clineRules)
	const updatedLocalToggles = await synchronizeRuleToggles(localClineRulesFilePath, localDalvikRulesToggles, "", [
		[".clinerules", "workflows"],
	])
	await updateWorkspaceState(context, "localDalvikRulesToggles", updatedLocalToggles)

	return {
		globalToggles: updatedGlobalToggles,
		localToggles: updatedLocalToggles,
	}
}
