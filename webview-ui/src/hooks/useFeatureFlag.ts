// Stub feature flag hook for offline mode - no PostHog needed

export const useFeatureFlag = (flagName: string): boolean => {
	// Offline mode: all feature flags disabled by default
	console.log(`Feature flag "${flagName}" checked (offline mode: disabled)`)
	return false
}
