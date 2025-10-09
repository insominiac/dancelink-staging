# Admin Partner Matching Management System

## Overview

The Admin Partner Matching Management System provides comprehensive tools for administrators to manage, monitor, and maintain the dance partner matching functionality. This system includes statistics, profile management, match request oversight, and active match monitoring.

## Features

### 📊 Statistics & Analytics
- **Overview Dashboard**: Real-time statistics including total profiles, active profiles, match requests, and successful matches
- **Success Metrics**: Match success rate and profile utilization percentages
- **Distribution Analysis**: 
  - Experience level breakdown
  - Geographic distribution (top locations)
  - Popular dance styles analysis
- **Activity Tracking**: Daily activity charts showing request and match trends

### 👥 Profile Management
- **Search & Filter**: Find profiles by name, experience level, location, or activity status
- **Profile Activation/Deactivation**: Enable or disable user profiles for matching
- **Activity Monitoring**: View sent/received request counts for each profile
- **Admin Notes**: Add administrative notes to profiles
- **Dance Styles Overview**: Quick view of user's dance specialties

### 💌 Match Request Oversight
- **Request Status Management**: 
  - Approve pending requests (creates automatic matches)
  - Reject inappropriate requests
  - Add administrative notes
- **Search & Filter**: Filter by status (pending, accepted, rejected, expired)
- **Request Details**: View complete request information including messages
- **Bulk Actions**: Manage multiple requests efficiently
- **Request Deletion**: Remove problematic requests with audit trail

### 💕 Active Match Management
- **Match Monitoring**: View all active and inactive matches
- **Match Score Display**: See compatibility scores for all matches
- **Status Control**: Activate or deactivate matches
- **Partner Information**: Complete user details for both partners
- **Administrative Notes**: Track admin interventions and decisions

## API Endpoints

### Statistics
```
GET /api/admin/partner-matching/stats
```
Returns comprehensive statistics and analytics data.

### Profiles
```
GET /api/admin/partner-matching/profiles
PATCH /api/admin/partner-matching/profiles/[id]
DELETE /api/admin/partner-matching/profiles/[id]
```
Manage user profiles with full CRUD operations.

### Match Requests
```
GET /api/admin/partner-matching/requests
PATCH /api/admin/partner-matching/requests/[id]
DELETE /api/admin/partner-matching/requests/[id]
```
Oversee and manage match requests between users.

### Matches
```
GET /api/admin/partner-matching/matches
PATCH /api/admin/partner-matching/matches/[id]
DELETE /api/admin/partner-matching/matches/[id]
```
Monitor and control active matches.

## Admin Actions

### Profile Management Actions
- **Activate/Deactivate**: Toggle profile availability for matching
- **Add Notes**: Administrative annotations for tracking decisions
- **View Activity**: Monitor user's matching behavior

### Match Request Actions
- **Approve**: Accept pending requests (automatically creates matches)
- **Reject**: Decline requests with reason tracking
- **Edit Notes**: Update administrative comments
- **Delete**: Remove problematic requests

### Match Management Actions
- **Activate/Deactivate**: Control match status
- **Add Notes**: Track administrative interventions
- **Monitor Activity**: View match progression and user interaction

## Security Features

- **Admin Authentication**: All endpoints require admin role verification
- **Audit Trail**: All administrative actions are logged
- **Data Protection**: Sensitive user information is properly secured
- **Transaction Safety**: Database operations use transactions for data integrity

## Usage Guidelines

### Best Practices
1. **Regular Monitoring**: Check pending requests daily
2. **Fair Moderation**: Apply consistent standards for request approval
3. **Documentation**: Use admin notes to track decisions and reasoning
4. **User Privacy**: Respect user privacy while maintaining system integrity

### Common Workflows
1. **Daily Request Review**: Filter by pending status, review and approve/reject
2. **Profile Cleanup**: Identify inactive profiles and manage accordingly
3. **Match Quality Control**: Monitor match success rates and intervene when necessary
4. **User Support**: Use admin tools to resolve user-reported issues

## Integration

The partner matching admin system is fully integrated into the main admin panel and can be accessed via the "Partner Matching" tab. It provides:

- Real-time statistics on the dashboard
- Seamless navigation between different management views
- Consistent UI/UX with other admin tools
- Mobile-responsive design for admin access on various devices

## Troubleshooting

### Common Issues
- **Empty Statistics**: Ensure database has matching data
- **API Errors**: Check admin authentication and permissions
- **Loading Issues**: Verify API endpoints are accessible

### Support
For technical support or feature requests, contact the development team with specific details about the issue and any error messages encountered.