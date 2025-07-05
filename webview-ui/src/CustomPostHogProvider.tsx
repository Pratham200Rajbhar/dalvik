// Stub PostHog provider for offline mode - no analytics needed
import type { ReactNode } from "react"

export function CustomPostHogProvider({ children }: { children: ReactNode }) {
	// Offline mode - no analytics or telemetry
	return <>{children}</>
}
