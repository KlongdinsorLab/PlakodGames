import {defineConfig, loadEnv} from 'vite'

export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
	const URL_PATH = process.env.VITE_URL_PATH

    return defineConfig({
        plugins: [],
        server: {host: '0.0.0.0', port: 8000},
        clearScreen: false,
		base: URL_PATH ? `/${URL_PATH}/`: undefined
    });
}
