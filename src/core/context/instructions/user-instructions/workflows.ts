import path from "path"
import { GlobalFileNames, ensureWorkflowsDirectoryExists } from "@core/storage/disk"
import { DalvikRulesToggles } from "@shared/cline-rules"
import { getWorkspaceState, updateWorkspaceState, getGlobalState, updateGlobalState } from "@core/storage/state"
import * as vscode from "vscode"
import { synchronizeRuleToggles } from "@core/context/instructions/user-instructions/rule-helpers"

/**
 * Refresh the workflow toggles
 */
export async function refreshWorkflowToggles(
	context: vscode.ExtensionContext,
	workingDirectory: string,
): Promise<{
	globalWorkflowToggles: DalvikRulesToggles
	localWorkflowToggles: DalvikRulesToggles
}> {
	// Global workflows
	const globalWorkflowToggles = ((await getGlobalState(context, "globalWorkflowToggles")) as DalvikRulesToggles) || {}
	const globalClineWorkflowsFilePath = await ensureWorkflowsDirectoryExists()
	const updatedGlobalWorkflowToggles = await synchronizeRuleToggles(globalClineWorkflowsFilePath, globalWorkflowToggles)
	await updateGlobalState(context, "globalWorkflowToggles", updatedGlobalWorkflowToggles)

	const workflowRulesToggles = ((await getWorkspaceState(context, "workflowToggles")) as DalvikRulesToggles) || {}
	const workflowsDirPath = path.resolve(workingDirectory, GlobalFileNames.workflows)
	const updatedWorkflowToggles = await synchronizeRuleToggles(workflowsDirPath, workflowRulesToggles)
	await updateWorkspaceState(context, "workflowToggles", updatedWorkflowToggles)

	return {
		globalWorkflowToggles: updatedGlobalWorkflowToggles,
		localWorkflowToggles: updatedWorkflowToggles,
	}
}
