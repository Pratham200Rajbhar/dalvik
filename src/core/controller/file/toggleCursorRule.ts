import type { ToggleCursorRuleRequest } from "../../../shared/proto/file"
import { ClineRulesToggles } from "../../../shared/proto/file"
import type { Controller } from "../index"
import { getWorkspaceState, updateWorkspaceState } from "../../../core/storage/state"
import { DalvikRulesToggles as AppDalvikRulesToggles } from "@shared/cline-rules"

/**
 * Toggles a Cursor rule (enable or disable)
 * @param controller The controller instance
 * @param request The toggle request
 * @returns The updated Cursor rule toggles
 */
export async function toggleCursorRule(controller: Controller, request: ToggleCursorRuleRequest): Promise<ClineRulesToggles> {
	const { rulePath, enabled } = request

	if (!rulePath || typeof enabled !== "boolean") {
		console.error("toggleCursorRule: Missing or invalid parameters", {
			rulePath,
			enabled: typeof enabled === "boolean" ? enabled : `Invalid: ${typeof enabled}`,
		})
		throw new Error("Missing or invalid parameters for toggleCursorRule")
	}

	// Update the toggles in workspace state
	const toggles = ((await getWorkspaceState(controller.context, "localCursorRulesToggles")) as AppDalvikRulesToggles) || {}
	toggles[rulePath] = enabled
	await updateWorkspaceState(controller.context, "localCursorRulesToggles", toggles)

	// Get the current state to return in the response
	const cursorToggles =
		((await getWorkspaceState(controller.context, "localCursorRulesToggles")) as AppDalvikRulesToggles) || {}

	return ClineRulesToggles.create({
		toggles: cursorToggles,
	})
}
