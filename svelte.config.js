import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        // Mode runes untuk Svelte 5 (mengabaikan node_modules)
        runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
    },
    kit: {
        // Konfigurasi adapter-static untuk GitHub Pages
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '404.html', // Sangat penting untuk SPA di GitHub Pages
            precompress: false,
            strict: true
        }),
        paths: {
            // Mengatur base path sesuai dengan nama repositori GitHub Anda
            base: process.argv.includes('dev') ? '' : '/frontend-gudang'
        }
    }
};

export default config;