// @ts-check
const config = {
  title: 'School Activities Wiki',
  tagline: 'A practical taxonomy for school day planning',
  url: 'https://example.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'chao-bi',
  projectName: 'school-activities-wiki',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: { sidebarPath: require.resolve('./sidebars.js'), routeBasePath: '/' },
        blog: false,
        theme: { customCss: [] },
      }),
    ],
  ],
  themes: [],
  themeConfig: {
    navbar: {
      title: 'School Activities Wiki',
      items: [
        { type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: 'Docs' },
        { href: 'https://github.com/', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} School Activities Wiki`,
    },
  },
};
module.exports = config;
