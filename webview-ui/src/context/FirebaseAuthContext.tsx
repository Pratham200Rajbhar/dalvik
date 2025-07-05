// Stub Firebase Auth Context for offline mode - no Firebase dependencies
import React, { createContext, useContext } from "react"

interface FirebaseAuthContextType {
	user: null
	isInitialized: boolean
	signInWithToken: (token: string) => Promise<void>
	handleSignOut: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Offline mode - no Firebase needed
	const value: FirebaseAuthContextType = {
		user: null,
		isInitialized: true,
		signInWithToken: async () => {
			console.log("Offline mode: no Firebase authentication")
		},
		handleSignOut: async () => {
			console.log("Offline mode: no Firebase authentication")
		},
	}

	return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>
}

export const useFirebaseAuth = () => {
	const context = useContext(FirebaseAuthContext)
	if (!context) {
		throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider")
	}
	return context
}
