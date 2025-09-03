# Authentication

FluentBoards uses WordPress Application Passwords for REST API authentication. You'll need to create application credentials to access the API securely.

## Creating API Credentials

### Step 1: Access REST API Settings

1. Navigate to `FluentBoards → Settings → Rest API`
2. You'll see the REST API Access Management interface

![REST API Settings](/assets/img/rest-api-settings.png)

### Step 2: Create New API Key

1. Click "Add New Key" button
2. Fill in the required information:
   - **Name of this key**: Enter a friendly name for identification
   - **Associate Administrator**: Select a WordPress Administrator or FluentBoards Administrator
3. Click "Create"

![Add New API Key](/assets/img/add-new-api-key.png)

### Step 3: Save Your Credentials

After creating the key, you'll receive:
- **API Username**: Your WordPress username
- **API Password**: Your application password

![API Credentials](/assets/img/api-credentials.png)

::: warning Important
Save these credentials immediately! The application password cannot be retrieved later.
:::

You can also download the credentials as a CSV file for safekeeping.

## Authentication Methods

### Basic Authentication (Recommended)

Use HTTP Basic Authentication with your API credentials:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/boards" \
  -H "Authorization: Basic $(echo -n 'API_USERNAME:API_PASSWORD' | base64)"
```

### URL Parameters (Not Recommended)

For testing only, you can pass credentials as URL parameters:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/boards?_wp_http_referer=API_USERNAME:API_PASSWORD"
```

::: warning Security Notice
Never use URL parameter authentication in production. Always use proper Authorization headers.
:::

## Example API Call

Here's a complete example of making an authenticated API request:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/boards" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json"
```

### Response

```json
{
  "data": [
    {
      "id": 1,
      "title": "Project Alpha",
      "description": "Main project board",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Success",
  "total": 1,
  "current_page": 1,
  "per_page": 15
}
```

## Programming Language Examples

### PHP

```php
<?php
$username = 'your_api_username';
$password = 'your_api_password';
$url = 'https://yourdomain.com/wp-json/fluent-boards/v2/boards';

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

const apiCredentials = Buffer.from('API_USERNAME:API_PASSWORD').toString('base64');

const config = {
  headers: {
    'Authorization': `Basic ${apiCredentials}`,
    'Content-Type': 'application/json'
  }
};

axios.get('https://yourdomain.com/wp-json/fluent-boards/v2/boards', config)
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

username = 'your_api_username'
password = 'your_api_password'
url = 'https://yourdomain.com/wp-json/fluent-boards/v2/boards'

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

username = 'your_api_username'
password = 'your_api_password'
url = URI('https://yourdomain.com/wp-json/fluent-boards/v2/boards')

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
curl "https://yourdomain.com/wp-json/fluent-boards/v2/boards" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

If successful, you'll receive a JSON response with your boards data.

## Troubleshooting

### Common Issues

**401 Unauthorized Error**
- Verify your username and password are correct
- Ensure the user account has proper administrator permissions
- Check that FluentBoards is properly installed and activated

**403 Forbidden Error**  
- The user account may lack necessary administrator permissions
- Verify the account is a WordPress Administrator or FluentBoards Administrator
- Check FluentBoards permission settings

**404 Not Found Error**
- Verify the API endpoint URL is correct
- Ensure FluentBoards is installed and the REST API is enabled
- Check your WordPress permalink structure

### Permission Requirements

Your API user account needs these minimum permissions:
- **WordPress Administrator role**: Full access to all endpoints
- **FluentBoards Administrator**: Access to FluentBoards-specific endpoints
- **Manage Options capability**: Required for administrative operations

## Security Best Practices

1. **Use HTTPS**: Always make API calls over secure connections
2. **Rotate Credentials**: Regularly update your API credentials
3. **Limit Permissions**: Grant only the minimum required permissions
4. **Monitor Usage**: Track API usage for unusual activity
5. **Secure Storage**: Never commit credentials to version control
6. **Dedicated Accounts**: Use dedicated user accounts for API access, not your main admin account

## Managing API Keys

### View Existing Keys

In the REST API settings, you can see all existing API keys associated with users. Each key shows:
- User information (ID, Name, Email)
- Associated API keys
- Management options

### Delete API Keys

To remove an API key:
1. Click the delete icon (×) on any API key tag
2. Confirm the deletion in the confirmation dialog
3. The key will be permanently removed

::: warning Important
Deleting an API key is permanent and cannot be undone. Any applications using that key will lose access immediately.
:::

## Next Steps

Now that you have authentication set up, you can:
- [Manage Boards](/rest-api/boards)
- [Handle Tasks](/rest-api/tasks)
- [Work with Stages](/rest-api/stages)
- [Access Users & Members](/rest-api/users)
- [Manage Labels](/rest-api/labels)
- [Set up Webhooks](/rest-api/webhooks)

