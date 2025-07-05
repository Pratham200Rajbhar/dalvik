// Simplified offline account info - no Firebase or cloud services needed

export const ClineAccountInfoCard = () => {
	return (
		<div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800 max-w-[600px]">
			<h3 className="text-lg font-semibold mb-2">Dalvik Agent - Offline Mode</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				You are running Dalvik in fully offline mode. No account or cloud services are required.
			</p>
			<div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
				All processing happens locally on your machine using Ollama.
			</div>
		</div>
	)
}
