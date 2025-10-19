import { defineConfig } from 'vite';

// Extra Vite configuration merged by Angular builder at dev time
export default defineConfig({
  define: {
    global: 'window',
    'process.env': {},
  },
});

