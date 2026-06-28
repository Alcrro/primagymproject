interface IApexFitLogoProps {
	className?: string;
	width?: number;
	height?: number;
}

export default function ApexFitLogo({
	className,
	width = 160,
	height = 64,
}: IApexFitLogoProps) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 172 58"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="ApexFit"
			role="img"
		>
			{/* Peak / triangle icon */}
			<polygon
				points="0,52 20,4 40,52"
				fill="#FF5C00"
			/>
			<polygon
				points="13,52 20,26 27,52"
				fill="white"
				fillOpacity="0.22"
			/>

			{/* APEX */}
			<text
				x="50"
				y="44"
				fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
				fontWeight="900"
				fontSize="40"
				fill="currentColor"
				letterSpacing="-0.5"
			>
				APEX
			</text>

			{/* FITNESS — centrat sub întregul logo */}
			<text
				x="94"
				y="55"
				textAnchor="middle"
				fontFamily="Arial, sans-serif"
				fontWeight="600"
				fontSize="11"
				fill="#FF5C00"
				letterSpacing="6"
			>
				FITNESS
			</text>
		</svg>
	);
}
