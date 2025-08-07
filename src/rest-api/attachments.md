# Attachments API

> **Note:** This documentation is under development. The Attachments API allows you to manage file attachments for tasks and boards.

## Overview

The Attachments API provides endpoints for uploading, managing, and retrieving file attachments associated with tasks and boards in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/attachments
```

## Available Endpoints

### List Attachments
- **GET** `/projects/{board_id}/attachments`
- **GET** `/projects/{board_id}/tasks/{task_id}/attachments`

### Upload Attachment
- **POST** `/projects/{board_id}/attachments`
- **POST** `/projects/{board_id}/tasks/{task_id}/attachments`

### Get Attachment
- **GET** `/attachments/{attachment_id}`

### Delete Attachment
- **DELETE** `/attachments/{attachment_id}`

## File Types Supported

- Images (JPG, PNG, GIF, SVG)
- Documents (PDF, DOC, DOCX, TXT)
- Archives (ZIP, RAR)
- Videos (MP4, AVI, MOV)
- Audio (MP3, WAV)

## File Size Limits

- Maximum file size: 50MB per file
- Total storage per project: 1GB

---

*This documentation will be expanded with detailed examples and complete API reference.* 