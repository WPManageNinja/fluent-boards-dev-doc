# What is FluentBoards?

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Basic" />

FluentBoards is a Project Management Plugin designed to facilitate collaborative work among team members. It offers the ability to showcase your team’s workflow directly on your WordPress site, eliminating the need for additional tools.

With FluentBoards, you can display your boards within the WordPress backend or on the front-end portal of your website. Packed with essential features, FluentBoards ensures seamless project planning and execution.

## FluentBoards Versions

FluentBoards comes in different versions:

**FluentBoards Core** is a free WordPress plugin.  A Board serves as a centralized hub for organizing workflow-related information. Whether you’re initiating a new project, planning, or managing ongoing tasks, the board provides a comprehensive overview of your team’s progress..

**FluentBoards Pro** is a paid version that adds a number of advanced features and options not found in the free version. It includes additional features such as: adding attachments to tasks, subtasks, custom fields, and more.

## Directory Structure

```yaml
├── app
│   ├── Api         # contains PHP API Utility classes
│   └── Functions   # contains global functions
│   └── Hooks       # actions and filters handlers
│   └── Http        # REST API routes, controllers, policies
│   └── Models      # Database Molders
│   └── Services    # Module Services
│   └── views       # php view files
│   └── App.php
│
├── assets          # contains css,js, media files
├── boot            # [internal] contains plugin boot files
├── config          # [internal] contains plugin framework top level config
├── database        # [internal] Database migration files
├── includes        # [internal] Old Framework deprecated classes
├── language        # [internal] Language Files
├── vendor          # [internal] Core Framework Files
│
└── fluent-boards.php  # Plugin entry File
```

