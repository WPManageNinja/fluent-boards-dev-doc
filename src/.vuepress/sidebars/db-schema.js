module.exports = [
    {
        title: 'Database Schema',
        collapsable: false,
        sidebarDepth: -1,
        children: [
            [
                '',
                'Introduction'
            ],
            [
                '/database/models/',
                'Model Basic'
            ],
            [
                '/database/query-builder',
                'Query Builder'
            ]
        ]
    },
    {
        title: 'Database Models',
        collapsable: true,
        sidebarDepth: -1,
        children: [
            [
                '/database/models/board',
                'Board Model'
            ],
            [
                '/database/models/stage',
                'Stage Model'
            ],
            [
                '/database/models/label',
                'Label Model'
            ],
            [
                '/database/models/task',
                'Task Model'
            ],
            [
                '/database/models/comment',
                'Comment Model'
            ],
            [
                '/database/models/activity',
                'Activity Model'
            ],
            [
                '/database/models/notification',
                'Notification Model'
            ],
            [
                '/database/models/notification-user',
                'NotificationUser Model'
            ],
            [
                '/database/models/task-meta',
                'TaskMeta Model'
            ],
            [
                '/database/models/team',
                'Team Model'
            ],
            [
                '/database/models/user',
                'User Model'
            ],
            [
                '/database/models/webhook',
                'Webhook Model'
            ],
        ]
    },
    {
        title: 'Fluent ORM',
        collapsable: true,
        sidebarDepth: -1,
        children: [
            [
                '/database/orm/',
                'Getting Started'
            ],
            [
                '/database/orm/relationship',
                'Relationships'
            ],
            [
                '/database/orm/collections',
                'Collections'
            ],
            [
                '/database/orm/mutators',
                'Mutators'
            ],
            [
                '/database/orm/serialization',
                'Serialization'
            ],
        ]
    }
];
