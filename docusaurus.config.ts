import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
const DefaultLocale = "en";

const config: Config = {
  title: 'IBAX',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/ibax.ico',
  url: "https://ibax-io.github.io",
  baseUrl: "/docs",

  organizationName: 'IBAX-io',
  projectName: 'docs', 
  deploymentBranch: "gh-pages",

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: "/",
          breadcrumbs: true,
          sidebarPath: './sidebars.ts',
          editUrl: ({ locale, versionDocsDirPath, docPath }) => {
            // Link to Crowdin for translate docs
            if (locale !== DefaultLocale) {
              return `https://crowdin.com/project/ibax-docs/${locale}`;
            }
            // Link to GitHub for English docs
            return `https://github.com/IBAX-io/docs/edit/main/${versionDocsDirPath}/${docPath}`;
          },
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'IBAX Documentation',
      logo: {
        alt: 'IBAX Logo',
        src: 'img/ibax.png',
      },
      items: [
        {
          type: "search",
          position: "right",
        },
        {
          type: 'docSidebar',
          sidebarId: 'conceptsSidebar',
          position: 'right',
          label: 'Concept',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialsSidebar',
          position: 'right',
          label: 'Tutorial',
        },
        {
          type: 'docSidebar',
          sidebarId: 'topicsSidebar',
          position: 'right',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'referenceSidebar',
          position: 'right',
          label: 'Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'howtosSidebar',
          position: 'right',
          label: 'Deployment',
        },
        {
          type: 'docSidebar',
          sidebarId: 'needleSidebar',
          position: 'right',
          label: 'Needle',
        },
        {
          type: "localeDropdown",
          position: "right",
          dropdownItemsAfter: [
            {
              type: "html",
              value: '<hr style="margin: 0.3rem 0;">',
            },
            {
              href: "https://crowdin.com/project/ibax-docs",
              label: "Help Us Translate",
            },
          ],
        },
        {
          href: "https://github.com/IBAX-io/docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    algolia: {
      // This API key is "search-only" and safe to be published
      apiKey: "9f2d21fc03a848de18d9e99df08b119d",
      appId: "QT93GL41QG",
      indexName: "ibax-docs",
      contextualSearch: true,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Documentation",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/ibaxnetwork",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/IBAX-io/docs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} IBAX Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
