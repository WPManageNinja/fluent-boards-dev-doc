<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="https://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>XML Sitemaps - FluentBoards Developer Documentation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #2c3e50;
            margin: 0 0 20px 0;
            font-size: 2.2em;
            font-weight: 600;
          }
          .index-link {
            color: #007bff;
            text-decoration: underline;
            font-size: 1em;
            margin-bottom: 15px;
            display: block;
          }
          .index-link:hover {
            color: #0056b3;
          }
          .subtitle {
            color: #6c757d;
            margin-bottom: 30px;
            font-size: 1em;
            line-height: 1.5;
          }
          .sitemap-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            overflow: hidden;
          }
          .sitemap-table th {
            background-color: #f8f9fa;
            color: #495057;
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
            font-weight: 600;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .sitemap-table th:first-child {
            text-align: left;
          }
          .sitemap-table th:last-child {
            text-align: right;
          }
          .sitemap-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f3f4;
            vertical-align: middle;
          }
          .sitemap-table tr:last-child td {
            border-bottom: none;
          }
          .sitemap-table tr:hover {
            background-color: #f8f9fa;
          }
          .sitemap-url {
            color: #007bff;
            text-decoration: underline;
            font-weight: 400;
            font-size: 0.9em;
            word-break: break-all;
          }
          .sitemap-url:hover {
            color: #0056b3;
            text-decoration: underline;
          }
          .lastmod {
            color: #6c757d;
            font-size: 0.85em;
            text-align: right;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          .priority {
            color: #6c757d;
            font-size: 0.85em;
            text-align: center;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          .count {
            background-color: #e9ecef;
            color: #495057;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.8em;
            font-weight: 600;
            margin: 0 2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemaps</h1>
          <a href="https://developers.fluentboards.com/sitemaps.xml" class="index-link">Index sitemaps</a>
          
          <!-- Handle sitemap index files -->
          <xsl:if test="sitemap:sitemapindex">
            <p class="subtitle">This XML Sitemap Index file contains <span class="count"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></span> sitemaps</p>
            
            <table class="sitemap-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last update</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}" class="sitemap-url">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="lastmod">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
          
          <!-- Handle regular sitemap files -->
          <xsl:if test="sitemap:urlset">
            <p class="subtitle">This XML Sitemap contains <span class="count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span> URLs</p>
            
            <table class="sitemap-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last update</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}" class="sitemap-url">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="lastmod">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                    <td class="priority">
                      <xsl:value-of select="sitemap:priority"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
