# Authentication

FluentBoards uses WordPress Application Passwords for REST API authentication. This is the standard WordPress authentication method that provides secure, non-interactive access to the REST API.

## Creating Application Passwords

### Step 1: Access User Profile

1. Log in to your WordPress admin dashboard
2. Navigate to `Users → Profile` (or `Users → All Users` and click on your user)
3. Scroll down to the "Application Passwords" section

### Step 2: Create New Application Password

1. In the "Application Passwords" section, enter a name for your application (e.g., "Fluent Boards API")
2. Click "Add New Application Password"

![WordPress Application Passwords](/assets/img/wordpress-app-passwords.png)

### Step 3: Save Your Credentials

After creating the application password, WordPress will display:
- **Username**: Your WordPress username
- **Application Password**: A generated password (e.g., "oqYd hptb PnKC XHur CJbG 01UW")

![Generated Application Password](/assets/img/wordpress-generated-password.png)

::: warning Important
Save these credentials immediately! The application password cannot be retrieved later and will only be shown once.
:::

::: tip Note
Application passwords are different from your regular WordPress password and are specifically designed for API access. They can be easily revoked if needed.
:::

## Authentication Methods

### Basic Authentication (Recommended)

Use HTTP Basic Authentication with your WordPress username and the Application Password. With curl, `-u` builds the header for you:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

If you set the header yourself, the `username:password` pair must be base64-encoded:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -H "Authorization: Basic $(echo -n 'USERNAME:APPLICATION_PASSWORD' | base64)"
```

::: tip
Application Passwords only work over HTTPS (or on a local site where WordPress allows them). The spaces WordPress shows in the generated password are optional.
:::

### Cookie Authentication (Not Recommended for API)

Requests from a logged-in browser session (like the FluentBoards admin app) authenticate with the WordPress login cookie plus a REST nonce in the `X-WP-Nonce` header (`wp_create_nonce('wp_rest')`). Without the nonce, WordPress treats the request as logged out:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -H "Cookie: wordpress_logged_in_xxx=your_cookie_value" \
  -H "X-WP-Nonce: your_rest_nonce"
```

::: warning Security Notice
Never use cookie authentication for API access in production. Always use Application Passwords with proper Authorization headers.
:::

## Example API Call

Here's a complete example of making an authenticated API request:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects?per_page=10" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

### Response

```json
{
  "boards": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Project Alpha",
        "description": "Main project board",
        "type": "to-do",
        "archived_at": null,
        "is_pinned": false,
        "completed_tasks_count": 4,
        "created_at": "2024-01-15T10:30:00+00:00",
        "updated_at": "2024-01-15T10:30:00+00:00"
      }
    ],
    "per_page": 10,
    "total": 1,
    "last_page": 1
  },
  "board_counts": {
    "all": 1,
    "pinned": 0,
    "archived": 0
  }
}
```

The board list is shortened. See [List Boards](/rest-api/boards) for the full response.

## Programming Language Examples

### PHP

```php
<?php
$username = 'your_username';
$password = 'your_application_password';
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

### JavaScript (Node.js)

```javascript
const axios = require('axios');

const apiCredentials = Buffer.from('USERNAME:APPLICATION_PASSWORD').toString('base64');

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

### Python

```python
import requests
from requests.auth import HTTPBasicAuth

username = 'your_username'
password = 'your_application_password'
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

### Ruby

```ruby
require 'net/http'
require 'uri'
require 'base64'

username = 'your_username'
password = 'your_application_password'
url = URI('https://yourdomain.com/wp-json/fluent-boards/v2/projects')

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request['Authorization'] = "Basic #{Base64.strict_encode64("#{username}:#{password}")}"
request['Content-Type'] = 'application/json'

response = http.request(request)
puts response.body
```

## Testing Your Authentication

To verify your credentials are working, make a simple API call:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

If successful, you'll receive a JSON response with your boards. A `401` response (for example `incorrect_password` or `rest_forbidden`) means WordPress did not accept the credentials.

## Troubleshooting

### Common Issues

**401 Unauthorized Error**
- Verify your username and application password are correct
- Ensure the application password hasn't been revoked
- Check that the user account has proper permissions
- Verify that FluentBoards is properly installed and activated

**403 Forbidden Error**  
- The user account may lack necessary permissions
- Verify the account has appropriate WordPress capabilities
- Check if the user has access to FluentBoards features

**404 Not Found Error**
- Verify the API endpoint URL is correct
- Ensure FluentBoards is installed and the REST API is enabled
- Check your WordPress permalink structure

### Permission Requirements

The API applies the same permissions as the FluentBoards app:

- **WordPress administrators** (`manage_options`) and **FluentBoards admins** can use every endpoint, including admin settings, webhooks and imports.
- **Board managers, members and viewers** can only reach the boards they belong to. Viewers are read-only; some actions (deleting tasks, managing members, board settings) need the board manager role.
- A logged-in user who is not on any board can only use a few user-level endpoints.

See [Managers & Roles](/rest-api/permissions#permission-model) for the full role model.

## Security Best Practices

1. **Use HTTPS**: Always make API calls over secure connections
2. **Rotate Credentials**: Regularly update your API credentials
3. **Limit Permissions**: Grant only the minimum required permissions
4. **Monitor Usage**: Track API usage for unusual activity
5. **Secure Storage**: Never commit credentials to version control
6. **Dedicated Accounts**: Use dedicated user accounts for API access, not your main admin account

## Managing Application Passwords

### View Existing Application Passwords

In your WordPress user profile, you can see all existing application passwords:
- Application name and creation date
- Last used date (if available)
- Management options

### Revoke Application Passwords

To revoke an application password:
1. Go to `Users → Profile` in WordPress admin
2. Scroll to the "Application Passwords" section
3. Click "Revoke" next to the application password you want to remove
4. Confirm the revocation

::: warning Important
Revoking an application password is permanent and cannot be undone. Any applications using that password will lose access immediately.
:::

### Best Practices for Application Passwords

1. **Use descriptive names**: Name your application passwords clearly (e.g., "Mobile App", "Third-party Integration")
2. **Regular rotation**: Periodically revoke and recreate application passwords
3. **One per application**: Create separate application passwords for different applications
4. **Monitor usage**: Check the "Last Used" information to identify unused passwords

## Next Steps

Now that you have authentication set up, you can:
- [Manage Boards](/rest-api/boards)
- [Handle Tasks](/rest-api/tasks)
- [Work with Stages](/rest-api/stages)
- [Access Users & Members](/rest-api/users)
- [Manage Labels](/rest-api/labels)
- [Set up Webhooks](/rest-api/webhooks)

