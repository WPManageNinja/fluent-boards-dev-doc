import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import dbSchemaSidebar from './sidebars/db-schema.js'
import globalFunctionsSidebar from './sidebars/global-functions.js'
import hooksSidebar from './sidebars/hooks.js'
import helpersSidebar from './sidebars/helpers.js'
import modulesSidebar from './sidebars/modules.js'
import restApiSidebar from './sidebars/rest-api.js'

export default withMermaid(defineConfig({
    title: 'FluentBoards Developers',
    description: 'Resources and tutorials for FluentBoards developers',
    lang: 'en-US',

    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: false,

    // Underscore-prefixed files are partials, not standalone pages
    srcExclude: ['**/_*.md', '**/_parts/**'],

    sitemap: {
        hostname: 'https://developers.fluentboards.com'
    },

    // mermaid pulls in CommonJS deps (fastdom); pre-bundle it so the dev server can load it
    vite: {
        optimizeDeps: {
            include: ['mermaid']
        }
    },

    markdown: {
        lineNumbers: true
    },

    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['link', { rel: 'mask-icon', href: '/assets/img/logo.svg', color: '#7742e6' }],
        ['link', { rel: 'apple-touch-icon', href: '/assets/img/logo.svg' }],
        ['meta', { name: 'theme-color', content: '#7742e6' }],
        ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['meta', { name: 'msapplication-TileImage', content: '/assets/img/icon.svg' }],
        ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
        ['meta', { name: 'algolia-site-verification', content: '287DD8149B883D8B' }],
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
        ['link', {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&display=auto'
        }],
        // Fluent Bot chat widget
        ['script', { type: 'module', src: 'https://cdn.jsdelivr.net/gh/fluent-docai/chat-widget@latest/chat-widget.js' }],
        ['script', { type: 'module' }, 'FluentBotChatWidget.injectWidget("7c0282bd-0ab9-4299-8532-2a870b347afb");']
    ],

    themeConfig: {
        logo: '/assets/img/icon.svg',

        search: {
            provider: 'algolia',
            options: {
                appId: 'BFUQ6C81LB',
                apiKey: 'f07487500b8e8e1456d054f87a2ce71f',
                indexName: 'developers-fluentboards'
            }
        },

        editLink: {
            pattern: 'https://github.com/WPManageNinja/fluent-boards-dev-doc/edit/master/src/:path',
            text: 'Edit this page on GitHub'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/WPManageNinja/fluent-boards-dev-doc' }
        ],

        outline: [2, 3],

        nav: [
            { text: 'Getting Started', link: '/getting-started/' },
            {
                text: 'Database',
                items: [
                    { text: 'Database Schema', link: '/database/' },
                    { text: 'Database Models', link: '/database/models/' }
                ]
            },
            {
                text: 'Developer Hooks',
                items: [
                    { text: 'Action Hooks', link: '/hooks/actions/' },
                    { text: 'Filter Hooks', link: '/hooks/filters/' },
                    { text: 'Global Functions', link: '/global-functions/' },
                    { text: 'Helpers Classes', link: '/helpers/' },
                    { text: 'WP-CLI Commands', link: '/cli/' }
                ]
            },
            {
                text: 'Modules',
                items: [
                    { text: 'Overview', link: '/modules/' },
                    { text: 'Boards', link: '/modules/boards' },
                    { text: 'Stages', link: '/modules/stages' },
                    { text: 'Tasks', link: '/modules/tasks' },
                    { text: 'Navigation', link: '/modules/navigation-modules' }
                ]
            },
            { text: 'REST API', link: '/rest-api/' },
            { text: 'Blog', link: 'https://fluentboards.com/blog/' }
        ],

        sidebar: {
            '/database/': dbSchemaSidebar,
            '/global-functions/': globalFunctionsSidebar,
            '/hooks/': hooksSidebar,
            '/helpers/': helpersSidebar,
            '/modules/': modulesSidebar,
            '/rest-api/': restApiSidebar
        }
    }
}))
