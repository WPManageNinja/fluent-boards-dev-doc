module.exports = [
  {
    title: 'Getting Started',
    collapsable: true,
    sidebarDepth: 1,
    children: [
      '',
      'authentication'
    ]
  },
  {
    title: 'Resources',
    collapsable: true,
    sidebarDepth: 1,
    children: [
      [ 'boards', 'Boards' ],
      [ 'tasks', 'Tasks' ],
      [ 'stages', 'Stages' ],
      [ 'labels', 'Labels' ],
      [ 'comments', 'Comments' ],
      [ 'subtasks', 'Subtasks' ],
      [ 'custom-fields', 'Custom Fields' ],
      [ 'folders', 'Folders' ],
      [ 'users', 'Users' ],
    ]
  },
  {
    title: 'Extending',
    collapsable: true,
    sidebarDepth: 1,
    children: [
      ['extend', 'Extending REST API']
    ]
  }
]