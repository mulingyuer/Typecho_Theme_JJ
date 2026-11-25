declare module "katex/contrib/auto-render" {
	interface AutoRenderOptions {
		delimiters?: Array<{
			left: string;
			right: string;
			display: boolean;
		}>;
		throwOnError?: boolean;
		strict?: boolean | "ignore" | "warn" | "error" | ((errorCode: string) => "ignore" | "warn" | "error");
		errorCallback?: (error: unknown) => void;
		ignoredTags?: string[];
	}

	const renderMathInElement: (element: HTMLElement, options?: AutoRenderOptions) => void;
	export default renderMathInElement;
}
