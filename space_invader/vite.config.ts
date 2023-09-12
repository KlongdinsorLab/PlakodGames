import {defineConfig, loadEnv} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
	const URL_PATH = process.env.VITE_URL_PATH

    return defineConfig({
        plugins: [tsconfigPaths()],
        server: {host: '0.0.0.0', port: 8000},
        clearScreen: false,
		base: URL_PATH ? `/${URL_PATH}/`: undefined
    });
}
