<div align="center">
    <img style="margin-top: 50px;" width="300" src="https://fluentboards.com/wp-content/uploads/2024/02/Logo-2-1.png" alt="FluentBoards Logo">
</div>

# Fluent Boards Developer Documentation

Welcome to the Fluent Boards Developer Documentation. This comprehensive guide provides everything you need to integrate with and extend Fluent Boards functionality.

## Production URL
- [https://developers.fluentboards.com](https://developers.fluentboards.com)


## Overview

Fluent Boards is a powerful self-hosted project management tool that provides a REST API for seamless integration with external applications and custom development. This documentation covers all aspects of working with Fluent Boards programmatically.

## Tech Stack
- **VitePress**: Static site generator for documentation
- **JavaScript**: Primary language for examples and code snippets
- **Markdown**: Format for writing documentation content
- **HTML/CSS**: For styling and structuring the documentation site
- **GitHub**: Version control and collaboration platform
- **Algolia**: Search functionality
- **Fluent Bot AI**: AI-powered assistance

## Development

### Building the Documentation

This documentation is built with [VitePress](https://vitepress.dev/). Node 18+ is required.

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # static site into src/.vitepress/dist
npm run preview   # serve the built site
```

A broken internal link fails `npm run build`, so run it before opening a PR.

### Layout

- `src/` — Markdown pages (`src/index.md` is the home page)
- `src/.vitepress/config.js` — site config, nav, search, head tags
- `src/.vitepress/sidebars/*.js` — one sidebar per section; add new pages here
- `src/.vitepress/theme/` — theme extension, custom CSS, `ExplainBlock` registration
- `src/public/` — static assets served from `/`
- Files named `_*.md` are partials and are not built as pages

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support and assistance:

- **Documentation Issues**: [Submit a GitHub issue](https://github.com/FluentBoards/fluent-boards-developers-docs/issues)
- **API Questions**: [Contact support](https://wpmanageninja.com/support-tickets/)
- **Feature Requests**: [Community forum](https://community.wpmanageninja.com/portal/space/fluent-boards/)

## License

This documentation is licensed under the MIT License.
