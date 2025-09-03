---
title: Developer Docs
tagline: Resources and tutorials for FluentBoards developer
sidebar: false
prev: false
next: false
editLink: true
pageClass: docs-home
---

<section id="home-hero">
  <h1>FluentBoards Developers Documentation</h1>
  <p>Learn how to extend FluentBoards core to create new integrations or add custom functionalities to your boards. Here you will find detailed documentation, handy code snippets and full code examples.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="/getting-started/">Get Started</a>
    <a class="btn btn-outline" href="/rest-api/">REST API</a>
    <a class="btn" href="https://fluentboards.com/" target="_blank" rel="noopener">Website</a>
    <a class="btn" href="https://fluentboards.com/docs/" target="_blank" rel="noopener">User Docs</a>
  </div>
  <p class="mini-note">Looking for end‑user help? Visit the <a href="https://fluentboards.com/docs/" target="_blank" rel="noopener">User Documentation ↗</a></p>
</section>

<section class="home-feature-cards">
  <div class="feature-card wide" style="grid-column:1/-1;">
    <h3>What You Can Do</h3>
    <p class="capabilities-intro">FluentBoards is fully extensible. A few high‑impact things you can implement quickly:</p>
    <ul class="capabilities-list">
      <li><strong>Push custom menus</strong> – inject board or global menu items (<a href="/hooks/filters/#fluent_boardsboard_menu_items">board_menu_items</a>, <a href="/hooks/filters/#fluent_boardsmenu_items">menu_items</a>).</li>
      <li><strong>Alter data with filter hooks</strong> – validate / transform before create or update (<a href="/hooks/filters/">filter hooks</a>).</li>
      <li><strong>Process events via actions</strong> – react to task, stage, label, comment lifecycle (<a href="/hooks/actions/">action hooks</a>).</li>
      <li><strong>Build external apps</strong> – use REST API + webhooks to power dashboards, automations, or mobile apps (<a href="/rest-api/">REST API</a>).</li>
    </ul>
    <p class="mini-note">Keep core updatable: write everything inside a separate add‑on plugin.</p>
  </div>
  <div class="feature-card">
    <h3>Extend</h3>
    <p>Hook into lifecycle events (create, update, move, complete) using powerful <a href="/hooks/actions/">action hooks</a>.</p>
  </div>
  <div class="feature-card">
    <h3>Automate</h3>
    <p>Use the <a href="/rest-api/">REST API</a> & webhooks to sync tasks with CRMs, help desks or internal tools.</p>
  </div>
  <div class="feature-card">
    <h3>Integrate</h3>
    <p>Ship add‑ons that leverage modular architecture – only load what you need, keep performance sharp.</p>
  </div>
  <div class="feature-card">
    <h3>Customize</h3>
    <p>Override behaviors with <a href="/hooks/filters/">filter hooks</a> & helper classes to shape data and UI output.</p>
  </div>
</section>

<section id="home-get-started" class="home-content">
  <div>
    <h2>Architecture</h2>
    <p>Learn about FluentBoards Data Structure, Framework Basics and how internal Components work together.</p>
  </div>
  <div>
    <ul>
      <li><a href="./database/">Database Schema</a></li>
      <li><a href="./database/models/">Database Model Basics</a></li>
      <li><a href="./database/models/task">Task Model</a></li>
      <li><a href="./database/models/board">Board Model</a></li>
    </ul>
  </div>
</section>

<section id="home-rest-api" class="home-content">
  <div>
    <h2>REST API</h2>
    <p>Access FluentBoards data programmatically with a robust and secure REST API. Build custom dashboards, automate workflows, or integrate with external services using familiar JSON endpoints.</p>
  </div>
  <div>
    <ul>
      <li><a href="./rest-api/">Overview</a></li>
      <li><a href="./rest-api/boards">Boards</a></li>
      <li><a href="./rest-api/tasks">Tasks</a></li>
      <li><a href="./rest-api/users">Users</a></li>
      <li><a href="./rest-api/webhooks">Webhooks</a></li>
    </ul>
  </div>
</section>

<section id="home-resources" class="home-content">
  <div>
    <h2>Resources</h2>
    <p>Helpful places to go next. Learn concepts, browse user‑facing guides or follow release updates.</p>
  </div>
  <div>
    <ul>
      <li><a href="/getting-started/">Developer Getting Started</a></li>
      <li><a href="https://fluentboards.com/" target="_blank" rel="noopener">Product Website ↗</a></li>
      <li><a href="https://fluentboards.com/docs/" target="_blank" rel="noopener">User Documentation ↗</a></li>
      <li><a href="https://fluentboards.com/blog/" target="_blank" rel="noopener">Blog & Release Notes ↗</a></li>
    </ul>
  </div>
</section>

<section id="home-internals" class="home-content">
  <div>
    <h2>Developer Hooks / Functions</h2>
    <p>FluentBoards offers numerous easy-to-use hooks, functions and PHP API to interact with it's data and underlying API. Learn more about them in the detailed sections</p>
  </div>
  <div>
    <ul>
      <li><a href="./hooks/actions/">Action Hooks</a></li>
      <li><a href="./hooks/filters/">Filter Hooks</a></li>
      <li><a href="./global-functions/">Global Functions</a></li>
      <li><a href="./helpers/">Helper Classes</a></li>
    </ul>
  </div>
</section>

<section id="home-components" class="home-content">
  <div>
    <h2>FluentBoards Modules</h2>
    <p>FluentBoards' modules are designed in a way that allows for easy extension, allowing you to build integrations in just a few 
    hours(Not in days), and giving you full control of your data.</p>
</div>
  <div>
    <ul>
      <li><a href="./modules/">Boards</a></li>
      <li><a href="./modules/boards/">Boards</a></li>
      <li><a href="./modules/stages/">Stages</a></li>
      <li><a href="./modules/tasks/">Tasks</a></li>
    </ul>
  </div>
</section>
