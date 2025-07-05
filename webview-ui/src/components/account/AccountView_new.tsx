import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import { vscode } from "@/utils/vscode"
import VSCodeButtonLink from "../common/VSCodeButtonLink"
import ClineLogoWhite from "../../assets/ClineLogoWhite"

type AccountViewProps = {
	onDone: () => void
}

const AccountView = ({ onDone }: AccountViewProps) => {
	return (
		<div className="fixed inset-0 flex flex-col overflow-hidden pt-[10px] pl-[20px]">
			<div className="flex justify-between items-center mb-[17px] pr-[17px]">
				<h3 className="text-[var(--vscode-foreground)] m-0">Account</h3>
				<VSCodeButton onClick={onDone}>Done</VSCodeButton>
			</div>
			<div className="flex-grow overflow-hidden pr-[8px] flex flex-col">
				<div className="h-full mb-[5px]">
					<ClineAccountView />
				</div>
			</div>
		</div>
	)
}

export const ClineAccountView = () => {
	return (
		<div className="flex flex-col h-full items-center justify-center text-center">
			<ClineLogoWhite className="w-16 h-16 mx-auto mb-4 opacity-50" />
			<h3 className="text-lg mb-2">Dalvik - Offline AI Assistant</h3>
			<p className="text-sm text-gray-600 mb-4 max-w-md">
				Dalvik runs completely offline using local Ollama models.
				<br />
				No account, subscription, or internet connection required.
			</p>
			<div className="space-y-2">
				<VSCodeButtonLink href="https://ollama.ai" className="block">
					Download Ollama
				</VSCodeButtonLink>
				<VSCodeButtonLink href="https://github.com/dalvik/dalvik" className="block">
					View Documentation
				</VSCodeButtonLink>
			</div>
		</div>
	)
}

export default memo(AccountView)
