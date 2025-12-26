# Database Export and Import

This directory contains scripts for exporting and importing the MongoDB database structure and data.

## Directory Structure

```
server/db/
├── exportDatabase.js      # Script to export database
├── importDatabase.js      # Script to import/restore database
├── README.md              # This file
└── exports/               # Directory containing export files
    ├── latest.json        # Latest export (symlink to most recent)
    ├── database-structure.json  # Database schema structure
    └── export-*.json     # Timestamped export files
```

## Export Database

Export the current database structure and/or data:

```bash
# From server directory

# Export schema + data (default - full export)
node db/exportDatabase.js
# or
npm run export-db

# Export schema only
node db/exportDatabase.js --schema

# Export data only
node db/exportDatabase.js --data

# Export schema + data (explicit)
node db/exportDatabase.js --full
```

### Export Options:

1. **Full Export (Default)**: `--full` or no arguments
   - Exports both database structure (schemas) and all data
   - Creates `database-structure.json` and `export-[timestamp].json`
   - Updates `latest.json` with data

2. **Schema Only**: `--schema`
   - Exports only database structure/schemas
   - Creates/updates `database-structure.json`
   - No data files created

3. **Data Only**: `--data`
   - Exports only database data (values)
   - Creates `export-[timestamp].json` and updates `latest.json`
   - Does not update structure file

### What Gets Exported:

**Full Export** will:
- Connect to MongoDB using `MONGODB_URI` from `.env`
- Export all collections (Hero, About, Service, Education, Project, ProjectImage, AdminUser, Message, Feedback, CV)
- Save data to `db/exports/export-[timestamp].json`
- Create/update `db/exports/latest.json` for easy access
- Save database structure to `db/exports/database-structure.json`

### Export File Format

```json
{
  "exportDate": "2025-01-25T10:30:00.000Z",
  "database": "portfolio_db",
  "collections": {
    "heroes": [...],
    "abouts": [...],
    "services": [...],
    "educations": [...],
    "projects": [...],
    "adminusers": [...],
    "messages": [...],
    "feedbacks": [...],
    "cvs": [...]
  }
}
```

## Import Database

Import/restore database from an export file:

```bash
# From server directory

# Import data (default)
node db/importDatabase.js
# or
npm run import-db

# Import specific export file
node db/importDatabase.js export-2025-01-25T10-30-00-000Z.json

# Import latest.json
node db/importDatabase.js latest.json

# Import with schema validation only
node db/importDatabase.js --schema
# or
npm run import-db-schema

# Import data only (skip schema validation)
node db/importDatabase.js [filename] --data
# or
npm run import-db-data

# Import data with explicit flag
node db/importDatabase.js [filename] --full
```

### Import Options:

1. **Data Import (Default)**: No flags or `--full`
   - Imports database data from export file
   - Uses `latest.json` if no filename provided
   - **⚠️ Warning:** Deletes all existing data before importing

2. **Schema Validation Only**: `--schema`
   - Validates database structure against `database-structure.json`
   - Does not import any data
   - Useful for checking schema compatibility before migration

3. **Data Only**: `--data`
   - Imports data without schema validation
   - Faster import when you're confident about schema compatibility

### Import Process

**Data Import:**
1. Reads the export file (or latest.json)
2. Connects to MongoDB
3. For each collection:
   - Deletes all existing documents
   - Inserts documents from export file
4. Handles duplicate key errors gracefully

**Schema Validation:**
1. Reads `database-structure.json`
2. Compares exported schema with current model schemas
3. Reports any mismatches or missing fields
4. Does not modify database

## Database Collections

The following collections are exported/imported:

- **heroes** - Hero section content
- **abouts** - About section content
- **services** - Services section content
- **educations** - Education section content
- **projects** - Portfolio projects
- **projectimages** - Project image metadata
- **adminusers** - Admin user accounts (passwords are hashed)
- **messages** - Contact form messages
- **feedbacks** - User feedback
- **cvs** - CV file metadata

## Notes

1. **Admin Users**: Passwords are stored as bcrypt hashes. When importing, existing passwords will be preserved.

2. **File Paths**: Uploaded files (images, CVs) are NOT included in the export. You'll need to manually copy the `server/public/` directory.

3. **Timestamps**: Export files are timestamped to allow multiple backups.

4. **Latest Export**: The `latest.json` file is always updated to point to the most recent export for convenience.

## Backup Strategy

Recommended backup workflow:

1. **Regular Exports**: Run export script regularly (daily/weekly)
2. **Version Control**: Commit `database-structure.json` to git (not data files)
3. **File Backups**: Also backup `server/public/` directory separately
4. **Environment**: Keep `.env` file secure and backed up separately

## Troubleshooting

### Export fails with connection error
- Check `MONGODB_URI` in `.env` file
- Ensure MongoDB is running
- Verify network/firewall settings

### Import fails with duplicate key error
- The script handles duplicates automatically
- If issues persist, manually clear collections first

### Missing collections in export
- Check if collections exist in database
- Verify model imports in export script

## Migration Workflow

When migrating to a new server:

1. **Export from source**:
   ```bash
   node db/exportDatabase.js
   ```

2. **Copy files**:
   - Copy `server/db/exports/latest.json` to new server
   - Copy `server/public/` directory to new server

3. **Import on destination**:
   ```bash
   node db/importDatabase.js latest.json
   ```

4. **Verify**:
   - Check all collections have data
   - Test admin login
   - Verify file paths are correct

