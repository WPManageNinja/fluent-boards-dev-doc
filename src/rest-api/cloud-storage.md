# Cloud Storage API

> **Note:** This is a Pro feature. The Cloud Storage API allows you to integrate with cloud storage providers.

## Overview

The Cloud Storage API provides endpoints for integrating with cloud storage providers like Google Drive, Dropbox, and OneDrive in Fluent Boards Pro.

## Base Endpoint

```
/fluent-boards/v2/cloud-storage
```

## Available Endpoints

### List Connected Services
- **GET** `/cloud-storage/services`

### Connect Service
- **POST** `/cloud-storage/connect`

### Disconnect Service
- **DELETE** `/cloud-storage/disconnect/{service_id}`

### List Files
- **GET** `/cloud-storage/{service_id}/files`

### Upload File
- **POST** `/cloud-storage/{service_id}/upload`

### Download File
- **GET** `/cloud-storage/{service_id}/download/{file_id}`

### Share File
- **POST** `/cloud-storage/{service_id}/share/{file_id}`

## Supported Services

- Google Drive
- Dropbox
- OneDrive
- Box
- Amazon S3

## Service Object

```json
{
  "id": 123,
  "service_type": "google_drive",
  "name": "My Google Drive",
  "account_email": "user@gmail.com",
  "is_connected": true,
  "storage_used": "2.5GB",
  "storage_limit": "15GB",
  "connected_at": "2024-01-15T10:30:00Z"
}
```

## Features

- Multi-service support
- File synchronization
- Automatic backups
- File sharing
- Version control
- Search capabilities

---

*This documentation will be expanded with detailed examples and complete API reference.* 