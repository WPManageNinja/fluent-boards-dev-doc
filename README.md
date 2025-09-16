<div align="center">
    <img style="margin-top: 50px;" width="300" src="https://fluentboards.com/wp-content/uploads/2024/02/Logo-2-1.png" alt="FluentBoards Logo">
</div>

# Fluent Boards Developer Documentation

Welcome to the Fluent Boards Developer Documentation. This comprehensive guide provides everything you need to integrate with and extend Fluent Boards functionality.

## Overview

Fluent Boards is a powerful project management tool that provides a REST API for seamless integration with external applications and custom development. This documentation covers all aspects of working with Fluent Boards programmatically.

## Documentation Structure

### REST API Documentation

The REST API documentation is organized into logical sections:

#### Core Resources
- **[Boards](/rest-api/boards)** - Manage boards
- **[Tasks](/rest-api/tasks)** - Handle tasks and task operations
- **[Stages](/rest-api/stages)** - Manage board stages and workflows
- **[Users & Members](/rest-api/users)** - Handle board members and permissions
- **[Labels](/rest-api/labels)** - Organize tasks with labels

#### Advanced Features
- **[Time Tracking](/rest-api/time-tracking)** - Track time and generate reports
- **[Attachments](/rest-api/attachments)** - Manage task files and attachments
- **[Comments](/rest-api/comments)** - Handle task comments and discussions
- **[Subtasks](/rest-api/subtasks)** - Manage task subtasks and checklists
- **[Custom Fields](/rest-api/custom-fields)** - Handle custom task data
- **[Webhooks](/rest-api/webhooks)** - Set up webhook integrations

#### Pro Features
- **[Folders](/rest-api/folders)** - Organize boards into folders
- **[Templates](/rest-api/templates)** - Work with board templates
- **[Roadmaps](/rest-api/roadmaps)** - Manage idea roadmaps and voting
- **[Cloud Storage](/rest-api/cloud-storage)** - Configure external storage
- **[Import/Export](/rest-api/import-export)** - Import and export data

#### Analytics & Reports
- **[Reports](/rest-api/reports)** - Access analytics and performance data
- **[Notifications](/rest-api/notifications)** - Handle user notifications
- **[Activities](/rest-api/activities)** - Track board and task activities

### Development Resources

#### Database & Models
- **[Database Schema](/database/)** - Complete database structure
- **[Models](/database/models/)** - Eloquent model documentation
- **[Query Builder](/database/query-builder.md)** - Database query examples

#### Hooks & Filters
- **[Actions](/hooks/actions/)** - WordPress action hooks
- **[Filters](/hooks/filters/)** - WordPress filter hooks
- **[Hook Changes](/hook_changes.md)** - Recent hook updates

#### Helper Functions
- **[Helper Functions](/helpers/)** - Utility functions
- **[Global Functions](/global-functions/)** - Available global functions
- **[Service Helpers](/helpers/service_helper.md)** - Service layer helpers

#### Modules & Extensions
- **[Modules](/modules/)** - Core module documentation
 - **[Extending REST API](/rest-api/extend)** - Custom endpoint development
- **[CLI Commands](/cli/)** - Command-line interface

## Quick Start

### 1. Set Up API Access

First, create WordPress Application Passwords:

1. Go to `Users → Profile` in WordPress admin
2. Scroll to "Application Passwords" section
3. Enter a name and click "Add New Application Password"
4. Save your username and generated application password

### 2. Make Your First API Call

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### 3. Explore Available Endpoints

- [List all boards](/rest-api/boards#list-all-boards)
- [Create a new task](/rest-api/tasks#create-a-task)
- [Set up webhooks](/rest-api/webhooks#create-a-webhook)

## API Base URL

All API requests should be made to:
```
https://yourdomain.com/wp-json/fluent-boards/v2
```

## Response Format

All API responses follow a consistent JSON structure:

```json
{
  "data": {}, // Response data
  "message": "Success message",
  "total": 100, // For paginated responses
  "current_page": 1,
  "per_page": 15
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## SDKs and Tools

While we don't provide official SDKs, the API works with any HTTP client library:

- **PHP**: Guzzle, cURL
- **JavaScript**: Axios, Fetch API
- **Python**: Requests
- **Ruby**: HTTParty
- Any language that supports HTTP requests

## Examples

### PHP Example

```php
<?php
$username = 'your_api_username';
$password = 'your_api_password';
$url = 'https://yourdomain.com/wp-json/fluent-boards/v2/projects';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
?>
```

### JavaScript Example

```javascript
const axios = require('axios');

const apiCredentials = Buffer.from('API_USERNAME:API_PASSWORD').toString('base64');

const config = {
  headers: {
    'Authorization': `Basic ${apiCredentials}`,
    'Content-Type': 'application/json'
  }
};

axios.get('https://yourdomain.com/wp-json/fluent-boards/v2/projects', config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });
```

### Python Example

```python
import requests
from requests.auth import HTTPBasicAuth

username = 'your_api_username'
password = 'your_api_password'
url = 'https://yourdomain.com/wp-json/fluent-boards/v2/projects'

response = requests.get(
    url,
    auth=HTTPBasicAuth(username, password),
    headers={'Content-Type': 'application/json'}
)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")
    print(response.text)
```

## Webhook Integration

Set up webhooks to receive real-time notifications:

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Slack Notifications",
    "url": "https://hooks.slack.com/services/YOUR_WEBHOOK_URL",
    "events": ["task.created", "task.completed"]
  }'
```

## Development

### Building the Documentation

This documentation is built using VuePress. To build locally:

```bash
npm install
npm run dev
```

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

## Changelog

See [changelog.md](changelog.md) for recent updates and changes to the API.

## License

This documentation is licensed under the MIT License.

---

**Ready to get started?** Begin with [Boards](/rest-api/boards) to explore the available endpoints.
