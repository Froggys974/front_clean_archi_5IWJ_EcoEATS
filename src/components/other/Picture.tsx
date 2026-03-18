import {JSX} from "react";

type PictureProps = {
  className?: string;
  imgClassName?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallbackImg?: string;
  height?: number;
  width?: number;
  alt: string;
  ariaHidden?: boolean;
  loading?: "lazy" | "eager";
};

/**
 * @description Picture html
 *
 * @param {string} className
 * @param {string} imgClassName
 * @param {string} mobile
 * @param {string} tablet
 * @param {string} desktop
 * @param {number} height
 * @param {number} width
 * @param {string} alt
 * @param {string} fallbackImg
 * @param {boolean} ariaHidden
 * @param {"lazy" | "eager"} loading
 *
 * @returns {JSX.Element}
 */
export default function Picture({
	className,
	imgClassName,
	mobile,
	tablet,
	desktop,
	fallbackImg,
	height,
	width,
	alt,
	ariaHidden,
	loading,
}: PictureProps) {
	const renderSources = (sourceSrc: string | undefined, media: string): JSX.Element | null => {
		if (!sourceSrc) return null;
		return (
			<>
				<source type="image/webp" media={media} srcSet={sourceSrc} />
				<source media={media} srcSet={sourceSrc} />
			</>
		);
	};

	return (
		<picture className={`block ${className || ""}`}>
			{renderSources(mobile, "(max-width: 767px)")}
			{renderSources(tablet, "(min-width: 768px) and (max-width: 1023px)")}
			{renderSources(desktop, "(min-width: 1024px)")}
			<img
				alt={alt}
				aria-hidden={ariaHidden}
				className={imgClassName || ""}
				height={height}
				width={width}
				src={fallbackImg || desktop || tablet || mobile || ""}
				loading={loading || "lazy"}
				draggable={false}
			/>
		</picture>
	);
}
