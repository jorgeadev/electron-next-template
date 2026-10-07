export type AppInfo = {
	name: string;
	version: string;
	platform: string;
	electron: string;
	chrome: string;
};

declare global {
	interface Window {
		electronAPI?: {
			getAppInfo: () => Promise<AppInfo>;
		};
	}
}
