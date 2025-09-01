# Reports API

> **Note:** This documentation is under development. The Reports API allows you to generate and retrieve various reports and analytics.

## Overview

The Reports API provides endpoints for generating and retrieving various reports and analytics about boards, tasks, and team performance in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/reports
```

## Available Endpoints

### List Available Reports
- **GET** `/reports`

### Generate Report
- **POST** `/reports/generate`

### Get Report
- **GET** `/reports/{report_id}`

### Download Report
- **GET** `/reports/{report_id}/download`

### Schedule Report
- **POST** `/reports/schedule`

### Get Scheduled Reports
- **GET** `/reports/scheduled`

### Delete Scheduled Report
- **DELETE** `/reports/scheduled/{schedule_id}`

## Report Types

### Project Reports
- Project Progress
- Task Completion
- Time Tracking
- Team Performance
- Resource Utilization

### Task Reports
- Task Status Distribution
- Task Priority Analysis
- Task Assignment Overview
- Task Completion Time
- Task Dependencies

### Time Reports
- Time Tracking Summary
- User Time Reports
- Project Time Analysis
- Overtime Reports
- Productivity Metrics

## Report Object

```json
{
  "id": 123,
  "name": "Project Progress Report",
  "type": "project_progress",
  "status": "completed",
  "generated_at": "2024-01-15T10:30:00Z",
  "download_url": "https://example.com/reports/123.pdf",
  "file_size": "2.5MB",
  "expires_at": "2024-02-15T10:30:00Z"
}
```

## Features

- Real-time data
- Custom date ranges
- Multiple export formats
- Automated scheduling
- Email delivery
- Interactive charts

---

*This documentation will be expanded with detailed examples and complete API reference.* 