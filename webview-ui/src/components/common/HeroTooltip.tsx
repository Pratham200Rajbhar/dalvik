import React from "react"

interface HeroTooltipProps {
	content: React.ReactNode
	children: React.ReactNode
	className?: string
	delay?: number
	closeDelay?: number
	placement?: "top" | "bottom" | "left" | "right"
}

/**
 * Simple tooltip replacement without HeroUI dependency
 */
const HeroTooltip: React.FC<HeroTooltipProps> = ({ content, children, className }) => {
	return (
		<div className={`relative group ${className || ""}`} title={typeof content === "string" ? content : undefined}>
			{children}
			{typeof content !== "string" && (
				<div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap z-50">
					{content}
				</div>
			)}
		</div>
	)
}

export default HeroTooltip
