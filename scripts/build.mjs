import { build } from 'vite';

const sharedBuildConfig = {
  configFile: false,
  build: {
    target: 'node20',
    outDir: 'dist',
    minify: false
  }
};

await build({
  ...sharedBuildConfig,
  build: {
    ...sharedBuildConfig.build,
    emptyOutDir: true,
    ssr: 'src/index.ts',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        format: 'es'
      }
    }
  }
});

await build({
  ...sharedBuildConfig,
  build: {
    ...sharedBuildConfig.build,
    emptyOutDir: false,
    ssr: 'src/cli/bin.ts',
    rollupOptions: {
      output: {
        entryFileNames: 'bin/sbti.js',
        format: 'es'
      }
    }
  }
});
