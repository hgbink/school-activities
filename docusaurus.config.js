// docusaurus.config.js
// CommonJS format (module.exports)

const fs = require('fs');
const path = require('path');

function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w, i) =>
      i === 0 ? w[0].toLowerCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1)
    )
    .join('');
}

function extractMetaTitleFromFile(filePath) {
  try {
    const md = fs.readFileSync(filePath, 'utf-8');
    const m = md.match(/```meta\s*\n([\s\S]*?)\n```/);
    if (!m) return null;
    const meta = JSON.parse(m[1]);
    return typeof meta.title === 'string' ? meta.title : null;
  } catch {
    return null;
  }
}

function makeDocPathResolver(contentPath) {
  return function resolveDocFile(docId) {
    const candidates = [
      path.join(contentPath, `${docId}.md`),
      path.join(contentPath, `${docId}.mdx`),
      path.join(contentPath, docId), // in case id already has extension
    ];
    for (const p of candidates) if (fs.existsSync(p)) return p;
    return null;
  };
}

module.exports = {
  // ✅ REQUIRED TOP-LEVEL FIELDS
  title: 'School Activities Wiki',
  url: 'https://example.com',       // for local dev this can stay as example.com
  baseUrl: '/',                     // site served at root

  // (nice-to-haves)
  favicon: 'img/favicon.ico',
  organizationName: 'your-org-or-user',
  projectName: 'school-activities-wiki',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',                         // docs at root
          sidebarPath: require.resolve('./sidebars.js'),

          // 👉 Option B: use meta.title for sidebar labels (or camelCase of it)
          sidebarItemsGenerator: async function ({ defaultSidebarItemsGenerator, ...args }) {
            const original_items = await defaultSidebarItemsGenerator(args);
            const resolveDocFile = makeDocPathResolver(args.version.contentPath);

            // hide logic: exclude docs whose id/basename is 'index'
            const shouldHide = (item) => {
              if (item.type === 'doc' && item.id){
                const filePath = resolveDocFile(item.id);
                const metaTitle = filePath ? extractMetaTitleFromFile(filePath) : null;
                return metaTitle === 'School Activities Wiki';
              }
              return false;
            };

            // remove items that should be hidden
            const items = original_items; //.filter((item) => !shouldHide(item));

            function relabel(nodes) {
              for (const n of nodes) {
                if (n.type === 'doc' && n.id) {
                  const filePath = resolveDocFile(n.id);
                  const metaTitle = filePath ? extractMetaTitleFromFile(filePath) : null;
                  if (metaTitle) {
                    // Use title exactly:
                    n.label = metaTitle;
                  }
                  else {
                    n.label = "Home";
                  }
                }
                if (n.items) relabel(n.items);
              }
            }

            relabel(items);

            //order by label
            items.sort((a, b) => a.label.localeCompare(b.label));

            // move Home to the top
            const home = items.find((item) => item.label === 'Home');
            if (home) {
              items.splice(items.indexOf(home), 1);
              items.unshift(home);
            }

            return items;
          },
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'School Activities Wiki',
      items: [
        { href: 'https://github.com/hgbink/school-activities', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} School Activities Wiki`,
    },
  },
};