import * as vscode from "vscode"
import { DEFAULT_CHAT_SETTINGS } from "@shared/ChatSettings"
import { DEFAULT_BROWSER_SETTINGS } from "@shared/BrowserSettings"
import { DEFAULT_AUTO_APPROVAL_SETTINGS } from "@shared/AutoApprovalSettings"
import { GlobalStateKey, LocalStateKey, SecretKey } from "./state-keys"
import { ApiConfiguration, ApiProvider, BedrockModelId, ModelInfo } from "@shared/api"
import { HistoryItem } from "@shared/HistoryItem"
import { AutoApprovalSettings } from "@shared/AutoApprovalSettings"
import { BrowserSettings } from "@shared/BrowserSettings"
import { StoredChatSettings } from "@shared/ChatSettings"
import { TelemetrySetting } from "@shared/TelemetrySetting"
import { UserInfo } from "@shared/UserInfo"
import { DalvikRulesToggles } from "@shared/cline-rules"
import { migrateEnableCheckpointsSetting, migrateMcpMarketplaceEnableSetting } from "./state-migrations"
/*
	Storage
	https://dev.to/kompotkot/how-to-use-secretstorage-in-your-vscode-extensions-2hco
	https://www.eliostruyf.com/devhack-code-extension-storage-options/
	*/

// global

export async function updateGlobalState(context: vscode.ExtensionContext, key: GlobalStateKey, value: any) {
	await context.globalState.update(key, value)
}

export async function getGlobalState(context: vscode.ExtensionContext, key: GlobalStateKey) {
	return await context.globalState.get(key)
}

// secrets

export async function storeSecret(context: vscode.ExtensionContext, key: SecretKey, value?: string) {
	if (value) {
		await context.secrets.store(key, value)
	} else {
		await context.secrets.delete(key)
	}
}

export async function getSecret(context: vscode.ExtensionContext, key: SecretKey) {
	return await context.secrets.get(key)
}

// workspace

export async function updateWorkspaceState(context: vscode.ExtensionContext, key: LocalStateKey, value: any) {
	await context.workspaceState.update(key, value)
}

export async function getWorkspaceState(context: vscode.ExtensionContext, key: LocalStateKey) {
	return await context.workspaceState.get(key)
}

export async function getAllExtensionState(context: vscode.ExtensionContext) {
	const [
		isNewUser,
		welcomeViewCompleted,
		apiKey,
		openRouterApiKey,
		dalvikApiKey,
		awsAccessKey,
		awsSecretKey,
		awsSessionToken,
		awsRegion,
		awsUseCrossRegionInference,
		awsBedrockUsePromptCache,
		awsBedrockEndpoint,
		awsProfile,
		awsUseProfile,
		vertexProjectId,
		vertexRegion,
		openAiBaseUrl,
		openAiApiKey,
		openAiHeaders,
		ollamaBaseUrl,
		ollamaApiOptionsCtxNum,
		lmStudioBaseUrl,
		anthropicBaseUrl,
		geminiApiKey,
		geminiBaseUrl,
		openAiNativeApiKey,
		deepSeekApiKey,
		requestyApiKey,
		togetherApiKey,
		qwenApiKey,
		doubaoApiKey,
		mistralApiKey,
		azureApiVersion,
		openRouterProviderSorting,
		lastShownAnnouncementId,
		taskHistory,
		autoApprovalSettings,
		browserSettings,
		liteLlmBaseUrl,
		liteLlmUsePromptCache,
		fireworksApiKey,
		fireworksModelMaxCompletionTokens,
		fireworksModelMaxTokens,
		userInfo,
		qwenApiLine,
		liteLlmApiKey,
		telemetrySetting,
		asksageApiKey,
		asksageApiUrl,
		xaiApiKey,
		sambanovaApiKey,
		cerebrasApiKey,
		nebiusApiKey,
		planActSeparateModelsSettingRaw,
		favoritedModelIds,
		globalDalvikRulesToggles,
		requestTimeoutMs,
		shellIntegrationTimeout,
		enableCheckpointsSettingRaw,
		mcpMarketplaceEnabledRaw,
		mcpRichDisplayEnabled,
		mcpResponsesCollapsedRaw,
		globalWorkflowToggles,
		terminalReuseEnabled,
		terminalOutputLineLimit,
		defaultTerminalProfile,
		sapAiCoreClientId,
		sapAiCoreClientSecret,
		sapAiCoreBaseUrl,
		sapAiCoreTokenUrl,
		sapAiResourceGroup,
		claudeCodePath,
	] = await Promise.all([
		getGlobalState(context, "isNewUser") as Promise<boolean | undefined>,
		getGlobalState(context, "welcomeViewCompleted") as Promise<boolean | undefined>,
		getSecret(context, "apiKey") as Promise<string | undefined>,
		getSecret(context, "openRouterApiKey") as Promise<string | undefined>,
		getSecret(context, "dalvikApiKey") as Promise<string | undefined>,
		getSecret(context, "awsAccessKey") as Promise<string | undefined>,
		getSecret(context, "awsSecretKey") as Promise<string | undefined>,
		getSecret(context, "awsSessionToken") as Promise<string | undefined>,
		getGlobalState(context, "awsRegion") as Promise<string | undefined>,
		getGlobalState(context, "awsUseCrossRegionInference") as Promise<boolean | undefined>,
		getGlobalState(context, "awsBedrockUsePromptCache") as Promise<boolean | undefined>,
		getGlobalState(context, "awsBedrockEndpoint") as Promise<string | undefined>,
		getGlobalState(context, "awsProfile") as Promise<string | undefined>,
		getGlobalState(context, "awsUseProfile") as Promise<boolean | undefined>,
		getGlobalState(context, "vertexProjectId") as Promise<string | undefined>,
		getGlobalState(context, "vertexRegion") as Promise<string | undefined>,
		getGlobalState(context, "openAiBaseUrl") as Promise<string | undefined>,
		getSecret(context, "openAiApiKey") as Promise<string | undefined>,
		getGlobalState(context, "openAiHeaders") as Promise<Record<string, string> | undefined>,
		getGlobalState(context, "ollamaBaseUrl") as Promise<string | undefined>,
		getGlobalState(context, "ollamaApiOptionsCtxNum") as Promise<string | undefined>,
		getGlobalState(context, "lmStudioBaseUrl") as Promise<string | undefined>,
		getGlobalState(context, "anthropicBaseUrl") as Promise<string | undefined>,
		getSecret(context, "geminiApiKey") as Promise<string | undefined>,
		getGlobalState(context, "geminiBaseUrl") as Promise<string | undefined>,
		getSecret(context, "openAiNativeApiKey") as Promise<string | undefined>,
		getSecret(context, "deepSeekApiKey") as Promise<string | undefined>,
		getSecret(context, "requestyApiKey") as Promise<string | undefined>,
		getSecret(context, "togetherApiKey") as Promise<string | undefined>,
		getSecret(context, "qwenApiKey") as Promise<string | undefined>,
		getSecret(context, "doubaoApiKey") as Promise<string | undefined>,
		getSecret(context, "mistralApiKey") as Promise<string | undefined>,
		getGlobalState(context, "azureApiVersion") as Promise<string | undefined>,
		getGlobalState(context, "openRouterProviderSorting") as Promise<string | undefined>,
		getGlobalState(context, "lastShownAnnouncementId") as Promise<string | undefined>,
		getGlobalState(context, "taskHistory") as Promise<HistoryItem[] | undefined>,
		getGlobalState(context, "autoApprovalSettings") as Promise<AutoApprovalSettings | undefined>,
		getGlobalState(context, "browserSettings") as Promise<BrowserSettings | undefined>,
		getGlobalState(context, "liteLlmBaseUrl") as Promise<string | undefined>,
		getGlobalState(context, "liteLlmUsePromptCache") as Promise<boolean | undefined>,
		getSecret(context, "fireworksApiKey") as Promise<string | undefined>,
		getGlobalState(context, "fireworksModelMaxCompletionTokens") as Promise<number | undefined>,
		getGlobalState(context, "fireworksModelMaxTokens") as Promise<number | undefined>,
		getGlobalState(context, "userInfo") as Promise<UserInfo | undefined>,
		getGlobalState(context, "qwenApiLine") as Promise<string | undefined>,
		getSecret(context, "liteLlmApiKey") as Promise<string | undefined>,
		getGlobalState(context, "telemetrySetting") as Promise<TelemetrySetting | undefined>,
		getSecret(context, "asksageApiKey") as Promise<string | undefined>,
		getGlobalState(context, "asksageApiUrl") as Promise<string | undefined>,
		getSecret(context, "xaiApiKey") as Promise<string | undefined>,
		getSecret(context, "sambanovaApiKey") as Promise<string | undefined>,
		getSecret(context, "cerebrasApiKey") as Promise<string | undefined>,
		getSecret(context, "nebiusApiKey") as Promise<string | undefined>,
		getGlobalState(context, "planActSeparateModelsSetting") as Promise<boolean | undefined>,
		getGlobalState(context, "favoritedModelIds") as Promise<string[] | undefined>,
		getGlobalState(context, "globalDalvikRulesToggles") as Promise<DalvikRulesToggles | undefined>,
		getGlobalState(context, "requestTimeoutMs") as Promise<number | undefined>,
		getGlobalState(context, "shellIntegrationTimeout") as Promise<number | undefined>,
		getGlobalState(context, "enableCheckpointsSetting") as Promise<boolean | undefined>,
		getGlobalState(context, "mcpMarketplaceEnabled") as Promise<boolean | undefined>,
		getGlobalState(context, "mcpRichDisplayEnabled") as Promise<boolean | undefined>,
		getGlobalState(context, "mcpResponsesCollapsed") as Promise<boolean | undefined>,
		getGlobalState(context, "globalWorkflowToggles") as Promise<DalvikRulesToggles | undefined>,
		getGlobalState(context, "terminalReuseEnabled") as Promise<boolean | undefined>,
		getGlobalState(context, "terminalOutputLineLimit") as Promise<number | undefined>,
		getGlobalState(context, "defaultTerminalProfile") as Promise<string | undefined>,
		getSecret(context, "sapAiCoreClientId") as Promise<string | undefined>,
		getSecret(context, "sapAiCoreClientSecret") as Promise<string | undefined>,
		getGlobalState(context, "sapAiCoreBaseUrl") as Promise<string | undefined>,
		getGlobalState(context, "sapAiCoreTokenUrl") as Promise<string | undefined>,
		getGlobalState(context, "sapAiResourceGroup") as Promise<string | undefined>,
		getGlobalState(context, "claudeCodePath") as Promise<string | undefined>,
	])

	const localDalvikRulesToggles = (await getWorkspaceState(context, "localDalvikRulesToggles")) as DalvikRulesToggles

	const [
		chatSettings,
		storedApiProvider,
		apiModelId,
		thinkingBudgetTokens,
		reasoningEffort,
		vsCodeLmModelSelector,
		awsBedrockCustomSelected,
		awsBedrockCustomModelBaseId,
		openRouterModelId,
		openRouterModelInfo,
		openAiModelId,
		openAiModelInfo,
		ollamaModelId,
		lmStudioModelId,
		liteLlmModelId,
		liteLlmModelInfo,
		requestyModelId,
		requestyModelInfo,
		togetherModelId,
		fireworksModelId,
		previousModeApiProvider,
		previousModeModelId,
		previousModeModelInfo,
		previousModeVsCodeLmModelSelector,
		previousModeThinkingBudgetTokens,
		previousModeReasoningEffort,
		previousModeAwsBedrockCustomSelected,
		previousModeAwsBedrockCustomModelBaseId,
		previousModeSapAiCoreModelId,
		sapAiCoreModelId,
	] = await Promise.all([
		getGlobalState(context, "chatSettings") as Promise<StoredChatSettings | undefined>,
		getGlobalState(context, "apiProvider") as Promise<ApiProvider | undefined>,
		getGlobalState(context, "apiModelId") as Promise<string | undefined>,
		getGlobalState(context, "thinkingBudgetTokens") as Promise<number | undefined>,
		getGlobalState(context, "reasoningEffort") as Promise<string | undefined>,
		getGlobalState(context, "vsCodeLmModelSelector") as Promise<vscode.LanguageModelChatSelector | undefined>,
		getGlobalState(context, "awsBedrockCustomSelected") as Promise<boolean | undefined>,
		getGlobalState(context, "awsBedrockCustomModelBaseId") as Promise<BedrockModelId | undefined>,
		getGlobalState(context, "openRouterModelId") as Promise<string | undefined>,
		getGlobalState(context, "openRouterModelInfo") as Promise<ModelInfo | undefined>,
		getGlobalState(context, "openAiModelId") as Promise<string | undefined>,
		getGlobalState(context, "openAiModelInfo") as Promise<ModelInfo | undefined>,
		getGlobalState(context, "ollamaModelId") as Promise<string | undefined>,
		getGlobalState(context, "lmStudioModelId") as Promise<string | undefined>,
		getGlobalState(context, "liteLlmModelId") as Promise<string | undefined>,
		getGlobalState(context, "liteLlmModelInfo") as Promise<ModelInfo | undefined>,
		getGlobalState(context, "requestyModelId") as Promise<string | undefined>,
		getGlobalState(context, "requestyModelInfo") as Promise<ModelInfo | undefined>,
		getGlobalState(context, "togetherModelId") as Promise<string | undefined>,
		getGlobalState(context, "fireworksModelId") as Promise<string | undefined>,
		getGlobalState(context, "previousModeApiProvider") as Promise<ApiProvider | undefined>,
		getGlobalState(context, "previousModeModelId") as Promise<string | undefined>,
		getGlobalState(context, "previousModeModelInfo") as Promise<ModelInfo | undefined>,
		getGlobalState(context, "previousModeVsCodeLmModelSelector") as Promise<vscode.LanguageModelChatSelector | undefined>,
		getGlobalState(context, "previousModeThinkingBudgetTokens") as Promise<number | undefined>,
		getGlobalState(context, "previousModeReasoningEffort") as Promise<string | undefined>,
		getGlobalState(context, "previousModeAwsBedrockCustomSelected") as Promise<boolean | undefined>,
		getGlobalState(context, "previousModeAwsBedrockCustomModelBaseId") as Promise<BedrockModelId | undefined>,
		getGlobalState(context, "previousModeSapAiCoreModelId") as Promise<string | undefined>,
		getGlobalState(context, "sapAiCoreModelId") as Promise<string | undefined>,
	])

	let apiProvider: ApiProvider
	if (storedApiProvider) {
		apiProvider = storedApiProvider
	} else {
		// Default Dalvik to use Ollama for offline operation
		apiProvider = "ollama"
	}

	const mcpMarketplaceEnabled = await migrateMcpMarketplaceEnableSetting(mcpMarketplaceEnabledRaw)
	const enableCheckpointsSetting = await migrateEnableCheckpointsSetting(enableCheckpointsSettingRaw)
	const mcpResponsesCollapsed = mcpResponsesCollapsedRaw ?? false

	// Plan/Act separate models setting is a boolean indicating whether the user wants to use different models for plan and act. Existing users expect this to be enabled, while we want new users to opt in to this being disabled by default.
	// On win11 state sometimes initializes as empty string instead of undefined
	let planActSeparateModelsSetting: boolean | undefined = undefined
	if (planActSeparateModelsSettingRaw === true || planActSeparateModelsSettingRaw === false) {
		planActSeparateModelsSetting = planActSeparateModelsSettingRaw
	} else {
		// default to true for existing users
		if (storedApiProvider) {
			planActSeparateModelsSetting = true
		} else {
			// default to false for new users
			planActSeparateModelsSetting = false
		}
		// this is a special case where it's a new state, but we want it to default to different values for existing and new users.
		// persist so next time state is retrieved it's set to the correct value.
		await updateGlobalState(context, "planActSeparateModelsSetting", planActSeparateModelsSetting)
	}

	// Set defaults for Ollama when no configuration exists
	const defaultOllamaBaseUrl = ollamaBaseUrl || "http://localhost:11434"
	const defaultOllamaModelId = ollamaModelId || "llama3:latest"

	return {
		apiConfiguration: {
			apiProvider,
			apiModelId,
			apiKey,
			openRouterApiKey,
			dalvikApiKey,
			claudeCodePath,
			awsAccessKey,
			awsSecretKey,
			awsSessionToken,
			awsRegion,
			awsUseCrossRegionInference,
			awsBedrockUsePromptCache,
			awsBedrockEndpoint,
			awsProfile,
			awsUseProfile,
			awsBedrockCustomSelected,
			awsBedrockCustomModelBaseId,
			vertexProjectId,
			vertexRegion,
			openAiBaseUrl,
			openAiApiKey,
			openAiModelId,
			openAiModelInfo,
			openAiHeaders: openAiHeaders || {},
			ollamaModelId: defaultOllamaModelId,
			ollamaBaseUrl: defaultOllamaBaseUrl,
			ollamaApiOptionsCtxNum,
			lmStudioModelId,
			lmStudioBaseUrl,
			anthropicBaseUrl,
			geminiApiKey,
			geminiBaseUrl,
			openAiNativeApiKey,
			deepSeekApiKey,
			requestyApiKey,
			requestyModelId,
			requestyModelInfo,
			togetherApiKey,
			togetherModelId,
			qwenApiKey,
			qwenApiLine,
			doubaoApiKey,
			mistralApiKey,
			azureApiVersion,
			openRouterModelId,
			openRouterModelInfo,
			openRouterProviderSorting,
			vsCodeLmModelSelector,
			thinkingBudgetTokens,
			reasoningEffort,
			liteLlmBaseUrl,
			liteLlmModelId,
			liteLlmModelInfo,
			liteLlmApiKey,
			liteLlmUsePromptCache,
			fireworksApiKey,
			fireworksModelId,
			fireworksModelMaxCompletionTokens,
			fireworksModelMaxTokens,
			asksageApiKey,
			asksageApiUrl,
			xaiApiKey,
			sambanovaApiKey,
			cerebrasApiKey,
			nebiusApiKey,
			favoritedModelIds,
			requestTimeoutMs,
			sapAiCoreClientId,
			sapAiCoreClientSecret,
			sapAiCoreBaseUrl,
			sapAiCoreTokenUrl,
			sapAiResourceGroup,
			sapAiCoreModelId,
		},
		isNewUser: isNewUser ?? true,
		welcomeViewCompleted,
		lastShownAnnouncementId,
		taskHistory,
		autoApprovalSettings: autoApprovalSettings || DEFAULT_AUTO_APPROVAL_SETTINGS, // default value can be 0 or empty string
		globalDalvikRulesToggles: globalDalvikRulesToggles || {},
		localDalvikRulesToggles: localDalvikRulesToggles || {},
		browserSettings: { ...DEFAULT_BROWSER_SETTINGS, ...browserSettings }, // this will ensure that older versions of browserSettings (e.g. before remoteBrowserEnabled was added) are merged with the default values (false for remoteBrowserEnabled)
		chatSettings: {
			...DEFAULT_CHAT_SETTINGS, // Apply defaults first
			...(chatSettings || {}), // Spread fetched chatSettings, which includes preferredLanguage, and openAIReasoningEffort
		},
		userInfo,
		previousModeApiProvider,
		previousModeModelId,
		previousModeModelInfo,
		previousModeVsCodeLmModelSelector,
		previousModeThinkingBudgetTokens,
		previousModeReasoningEffort,
		previousModeAwsBedrockCustomSelected,
		previousModeAwsBedrockCustomModelBaseId,
		previousModeSapAiCoreModelId,
		mcpMarketplaceEnabled: mcpMarketplaceEnabled,
		mcpRichDisplayEnabled: mcpRichDisplayEnabled ?? true,
		mcpResponsesCollapsed: mcpResponsesCollapsed,
		telemetrySetting: telemetrySetting || "unset",
		planActSeparateModelsSetting,
		enableCheckpointsSetting: enableCheckpointsSetting,
		shellIntegrationTimeout: shellIntegrationTimeout || 4000,
		terminalReuseEnabled: terminalReuseEnabled ?? true,
		terminalOutputLineLimit: terminalOutputLineLimit ?? 500,
		defaultTerminalProfile: defaultTerminalProfile ?? "default",
		globalWorkflowToggles: globalWorkflowToggles || {},
	}
}

export async function updateApiConfiguration(context: vscode.ExtensionContext, apiConfiguration: ApiConfiguration) {
	const {
		apiProvider,
		apiModelId,
		apiKey,
		openRouterApiKey,
		awsAccessKey,
		awsSecretKey,
		awsSessionToken,
		awsRegion,
		awsUseCrossRegionInference,
		awsBedrockUsePromptCache,
		awsBedrockEndpoint,
		awsProfile,
		awsUseProfile,
		awsBedrockCustomSelected,
		awsBedrockCustomModelBaseId,
		vertexProjectId,
		vertexRegion,
		openAiBaseUrl,
		openAiApiKey,
		openAiModelId,
		openAiModelInfo,
		openAiHeaders,
		ollamaModelId,
		ollamaBaseUrl,
		ollamaApiOptionsCtxNum,
		lmStudioModelId,
		lmStudioBaseUrl,
		anthropicBaseUrl,
		geminiApiKey,
		geminiBaseUrl,
		openAiNativeApiKey,
		deepSeekApiKey,
		requestyApiKey,
		requestyModelId,
		requestyModelInfo,
		togetherApiKey,
		togetherModelId,
		qwenApiKey,
		doubaoApiKey,
		mistralApiKey,
		azureApiVersion,
		openRouterModelId,
		openRouterModelInfo,
		openRouterProviderSorting,
		vsCodeLmModelSelector,
		liteLlmBaseUrl,
		liteLlmModelId,
		liteLlmModelInfo,
		liteLlmApiKey,
		liteLlmUsePromptCache,
		qwenApiLine,
		asksageApiKey,
		asksageApiUrl,
		xaiApiKey,
		thinkingBudgetTokens,
		reasoningEffort,
		dalvikApiKey,
		sambanovaApiKey,
		cerebrasApiKey,
		nebiusApiKey,
		favoritedModelIds,
		fireworksApiKey,
		fireworksModelId,
		fireworksModelMaxCompletionTokens,
		fireworksModelMaxTokens,
		sapAiCoreClientId,
		sapAiCoreClientSecret,
		sapAiCoreBaseUrl,
		sapAiCoreTokenUrl,
		sapAiResourceGroup,
		sapAiCoreModelId,
		claudeCodePath,
	} = apiConfiguration

	// Ephemeral model config updates
	await updateGlobalState(context, "apiProvider", apiProvider)
	await updateGlobalState(context, "apiModelId", apiModelId)
	await updateGlobalState(context, "thinkingBudgetTokens", thinkingBudgetTokens)
	await updateGlobalState(context, "reasoningEffort", reasoningEffort)
	await updateGlobalState(context, "vsCodeLmModelSelector", vsCodeLmModelSelector)
	await updateGlobalState(context, "awsBedrockCustomSelected", awsBedrockCustomSelected)
	await updateGlobalState(context, "awsBedrockCustomModelBaseId", awsBedrockCustomModelBaseId)
	await updateGlobalState(context, "openRouterModelId", openRouterModelId)
	await updateGlobalState(context, "openRouterModelInfo", openRouterModelInfo)
	await updateGlobalState(context, "openAiModelId", openAiModelId)
	await updateGlobalState(context, "openAiModelInfo", openAiModelInfo)
	await updateGlobalState(context, "ollamaModelId", ollamaModelId)
	await updateGlobalState(context, "lmStudioModelId", lmStudioModelId)
	await updateGlobalState(context, "liteLlmModelId", liteLlmModelId)
	await updateGlobalState(context, "liteLlmModelInfo", liteLlmModelInfo)
	await updateGlobalState(context, "requestyModelId", requestyModelId)
	await updateGlobalState(context, "requestyModelInfo", requestyModelInfo)
	await updateGlobalState(context, "togetherModelId", togetherModelId)
	await updateGlobalState(context, "fireworksModelId", fireworksModelId)
	await updateGlobalState(context, "sapAiCoreModelId", sapAiCoreModelId)

	// Global state updates
	await updateGlobalState(context, "awsRegion", awsRegion)
	await updateGlobalState(context, "awsUseCrossRegionInference", awsUseCrossRegionInference)
	await updateGlobalState(context, "awsBedrockUsePromptCache", awsBedrockUsePromptCache)
	await updateGlobalState(context, "awsBedrockEndpoint", awsBedrockEndpoint)
	await updateGlobalState(context, "awsProfile", awsProfile)
	await updateGlobalState(context, "awsUseProfile", awsUseProfile)
	await updateGlobalState(context, "vertexProjectId", vertexProjectId)
	await updateGlobalState(context, "vertexRegion", vertexRegion)
	await updateGlobalState(context, "openAiBaseUrl", openAiBaseUrl)
	await updateGlobalState(context, "openAiHeaders", openAiHeaders || {})
	await updateGlobalState(context, "ollamaBaseUrl", ollamaBaseUrl)
	await updateGlobalState(context, "ollamaApiOptionsCtxNum", ollamaApiOptionsCtxNum)
	await updateGlobalState(context, "lmStudioBaseUrl", lmStudioBaseUrl)
	await updateGlobalState(context, "anthropicBaseUrl", anthropicBaseUrl)
	await updateGlobalState(context, "geminiBaseUrl", geminiBaseUrl)
	await updateGlobalState(context, "azureApiVersion", azureApiVersion)
	await updateGlobalState(context, "openRouterProviderSorting", openRouterProviderSorting)
	await updateGlobalState(context, "liteLlmBaseUrl", liteLlmBaseUrl)
	await updateGlobalState(context, "liteLlmUsePromptCache", liteLlmUsePromptCache)
	await updateGlobalState(context, "qwenApiLine", qwenApiLine)
	await updateGlobalState(context, "asksageApiUrl", asksageApiUrl)
	await updateGlobalState(context, "favoritedModelIds", favoritedModelIds)
	await updateGlobalState(context, "requestTimeoutMs", apiConfiguration.requestTimeoutMs)
	await updateGlobalState(context, "fireworksModelMaxCompletionTokens", fireworksModelMaxCompletionTokens)
	await updateGlobalState(context, "fireworksModelMaxTokens", fireworksModelMaxTokens)
	await updateGlobalState(context, "sapAiCoreBaseUrl", sapAiCoreBaseUrl)
	await updateGlobalState(context, "sapAiCoreTokenUrl", sapAiCoreTokenUrl)
	await updateGlobalState(context, "sapAiResourceGroup", sapAiResourceGroup)
	await updateGlobalState(context, "claudeCodePath", claudeCodePath)

	// Secret updates
	await storeSecret(context, "apiKey", apiKey)
	await storeSecret(context, "openRouterApiKey", openRouterApiKey)
	await storeSecret(context, "dalvikApiKey", dalvikApiKey)
	await storeSecret(context, "awsAccessKey", awsAccessKey)
	await storeSecret(context, "awsSecretKey", awsSecretKey)
	await storeSecret(context, "awsSessionToken", awsSessionToken)
	await storeSecret(context, "openAiApiKey", openAiApiKey)
	await storeSecret(context, "geminiApiKey", geminiApiKey)
	await storeSecret(context, "openAiNativeApiKey", openAiNativeApiKey)
	await storeSecret(context, "deepSeekApiKey", deepSeekApiKey)
	await storeSecret(context, "requestyApiKey", requestyApiKey)
	await storeSecret(context, "togetherApiKey", togetherApiKey)
	await storeSecret(context, "qwenApiKey", qwenApiKey)
	await storeSecret(context, "doubaoApiKey", doubaoApiKey)
	await storeSecret(context, "mistralApiKey", mistralApiKey)
	await storeSecret(context, "liteLlmApiKey", liteLlmApiKey)
	await storeSecret(context, "fireworksApiKey", fireworksApiKey)
	await storeSecret(context, "asksageApiKey", asksageApiKey)
	await storeSecret(context, "xaiApiKey", xaiApiKey)
	await storeSecret(context, "sambanovaApiKey", sambanovaApiKey)
	await storeSecret(context, "cerebrasApiKey", cerebrasApiKey)
	await storeSecret(context, "nebiusApiKey", nebiusApiKey)
	await storeSecret(context, "sapAiCoreClientId", sapAiCoreClientId)
	await storeSecret(context, "sapAiCoreClientSecret", sapAiCoreClientSecret)
}

export async function resetWorkspaceState(context: vscode.ExtensionContext) {
	for (const key of context.workspaceState.keys()) {
		await context.workspaceState.update(key, undefined)
	}
}

export async function resetGlobalState(context: vscode.ExtensionContext) {
	// TODO: Reset all workspace states?
	for (const key of context.globalState.keys()) {
		await context.globalState.update(key, undefined)
	}
	const secretKeys: SecretKey[] = [
		"apiKey",
		"openRouterApiKey",
		"awsAccessKey",
		"awsSecretKey",
		"awsSessionToken",
		"openAiApiKey",
		"geminiApiKey",
		"openAiNativeApiKey",
		"deepSeekApiKey",
		"requestyApiKey",
		"togetherApiKey",
		"qwenApiKey",
		"doubaoApiKey",
		"mistralApiKey",
		"dalvikApiKey",
		"liteLlmApiKey",
		"fireworksApiKey",
		"asksageApiKey",
		"xaiApiKey",
		"sambanovaApiKey",
		"cerebrasApiKey",
		"nebiusApiKey",
	]
	for (const key of secretKeys) {
		await storeSecret(context, key, undefined)
	}
}
