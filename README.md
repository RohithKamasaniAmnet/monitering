# Cron Monitor Application

A full-stack web application for monitoring cron jobs across different environments.

## Prerequisites

- Node.js v16.x
- PostgreSQL 12+
- Ubuntu Server 20.04 LTS or higher

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd cron-monitor
   ```

2. **Install Node.js v16**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL**
   ```bash
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib
   ```

4. **Configure PostgreSQL**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE cron_monitor;
   \c cron_monitor
   \i database/schema.sql
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   - Set database credentials
   - Configure server timezone
   - Update API URL if needed

7. **Build the Application**
   ```bash
   npm run build
   ```

8. **Setup PM2 for Process Management**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "cron-monitor" -- start
   pm2 startup
   pm2 save
   ```

## Environment Variables

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port
- `SERVER_TIMEZONE`: Server timezone (e.g., 'America/Chicago')
- `VITE_API_URL`: Backend API URL

## Server Timezone Configuration

The application uses the `SERVER_TIMEZONE` environment variable to handle time conversions consistently. This ensures that even if the server's system timezone changes, the application will continue to use the configured timezone.

To change the timezone:
1. Update the `SERVER_TIMEZONE` in `.env`
2. Restart the application: `pm2 restart cron-monitor`

## Maintenance

- **View Logs**
  ```bash
  pm2 logs cron-monitor
  ```

- **Monitor Application**
  ```bash
  pm2 monit
  ```

- **Restart Application**
  ```bash
  pm2 restart cron-monitor
  ```

## Backup and Restore

1. **Backup Database**
   ```bash
   pg_dump -U postgres cron_monitor > backup.sql
   ```

2. **Restore Database**
   ```bash
   psql -U postgres cron_monitor < backup.sql
   ```

## Security Considerations

1. Use strong passwords for database
2. Configure firewall rules
3. Keep Node.js and dependencies updated
4. Use HTTPS in production
5. Regularly backup the database

## Troubleshooting

1. **Database Connection Issues**
   - Check PostgreSQL service: `sudo service postgresql status`
   - Verify credentials in `.env`
   - Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-12-main.log`

2. **Application Not Starting**
   - Check Node.js version: `node --version`
   - Verify all dependencies are installed: `npm install`
   - Check PM2 logs: `pm2 logs cron-monitor`

3. **Timezone Issues**
   - Verify SERVER_TIMEZONE in .env
   - Check system timezone: `timedatectl`
   - Ensure date-fns-tz is properly configured