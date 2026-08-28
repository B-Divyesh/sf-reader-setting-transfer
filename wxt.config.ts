import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  outDir: '.output',
  modules: [],
  manifest: {
    name: 'Reader Setting Transfer',
    short_name: 'Reader Transfer',
    version: '1.0.0',
    description: 'Carry your readable text settings into a clean, local article reader.',
    permissions: ['storage', 'activeTab', 'scripting'],
    action: {
      default_title: 'Read this article with my settings'
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true
    },
    icons: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png'
    }
  }
});
