import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all models
import Hero from '../src/models/Hero.js';
import About from '../src/models/About.js';
import Service from '../src/models/Service.js';
import Education from '../src/models/Education.js';
import Project from '../src/models/Project.js';
import ProjectImage from '../src/models/ProjectImage.js';
import AdminUser from '../src/models/AdminUser.js';
import Message from '../src/models/Message.js';
import Feedback from '../src/models/Feedback.js';
import CV from '../src/models/CV.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/**
 * Import/restore database from export file
 * Usage: 
 *   node db/importDatabase.js [filename]              # Import data (default)
 *   node db/importDatabase.js [filename] --schema     # Import schema only (validate structure)
 *   node db/importDatabase.js [filename] --data       # Import data only
 *   node db/importDatabase.js [filename] --full        # Import data (same as default)
 *   node db/importDatabase.js latest.json             # Import latest data
 *   node db/importDatabase.js export-2025-01-25T10-30-00-000Z.json
 */
const importDatabase = async () => {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const importSchema = args.includes('--schema') || args.includes('--full');
    const importData = args.includes('--data') || args.includes('--full') || (!args.includes('--schema') && !args.includes('--data') && !args.includes('--full'));
    const schemaOnly = args.includes('--schema') && !args.includes('--data') && !args.includes('--full');
    const dataOnly = args.includes('--data') && !args.includes('--schema') && !args.includes('--full');

    if (schemaOnly) {
      console.log('📋 Import mode: Schema validation only\n');
    } else if (dataOnly) {
      console.log('💾 Import mode: Data only\n');
    } else {
      console.log('📦 Import mode: Data import (default)\n');
    }

    // Get export file path
    const exportDir = path.join(__dirname, 'exports');
    const dataFileArgs = args.filter(arg => !arg.startsWith('--'));
    let exportFile;
    let structureFile;

    if (dataFileArgs.length > 0) {
      // Use provided filename
      exportFile = path.join(exportDir, dataFileArgs[0]);
    } else {
      // Use latest.json by default
      exportFile = path.join(exportDir, 'latest.json');
    }

    // Structure file is always database-structure.json
    structureFile = path.join(exportDir, 'database-structure.json');

    // Connect to database
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Map collection names to models
    const collectionMap = {
      heroes: Hero,
      abouts: About,
      services: Service,
      educations: Education,
      projects: Project,
      projectimages: ProjectImage,
      adminusers: AdminUser,
      messages: Message,
      feedbacks: Feedback,
      cvs: CV,
    };

    // Import/validate schema structure
    if (importSchema) {
      console.log('📋 Validating database structure...');
      
      if (!fs.existsSync(structureFile)) {
        console.error(`✗ Structure file not found: ${structureFile}`);
        if (schemaOnly) {
          console.error('Cannot proceed with schema-only import without structure file.');
          await mongoose.connection.close();
          process.exit(1);
        } else {
          console.log('⚠ Continuing with data import only...\n');
        }
      } else {
        try {
          const structureData = JSON.parse(fs.readFileSync(structureFile, 'utf8'));
          console.log(`  Reading structure file: ${structureFile}`);
          console.log(`  Structure export date: ${structureData.exportDate}\n`);

          // Validate each collection schema
          for (const [collectionName, schemaInfo] of Object.entries(structureData.schemas || {})) {
            if (!collectionMap[collectionName]) {
              console.log(`  ⚠ Unknown collection in structure: ${collectionName}`);
              continue;
            }

            const Model = collectionMap[collectionName];
            const currentSchema = Model.schema;
            const exportedSchema = schemaInfo.schema;

            console.log(`  ✓ Validating schema for ${collectionName}...`);
            
            // Check if key fields match
            let schemaMatch = true;
            for (const [fieldName, fieldInfo] of Object.entries(exportedSchema)) {
              const currentField = currentSchema.paths[fieldName];
              if (!currentField) {
                console.log(`    ⚠ Field '${fieldName}' exists in export but not in current schema`);
                schemaMatch = false;
              } else {
                const currentType = currentField.instance;
                const exportedType = fieldInfo.type;
                if (currentType !== exportedType) {
                  console.log(`    ⚠ Field '${fieldName}' type mismatch: current=${currentType}, exported=${exportedType}`);
                  schemaMatch = false;
                }
              }
            }

            if (schemaMatch) {
              console.log(`    ✓ Schema for ${collectionName} matches`);
            }
          }
          console.log('\n✓ Schema validation completed\n');
        } catch (error) {
          console.error(`✗ Error reading structure file:`, error.message);
          if (schemaOnly) {
            await mongoose.connection.close();
            process.exit(1);
          }
        }
      }
    }

    // Import data
    if (importData) {
      console.log('💾 Importing database data...');

      // Check if file exists
      if (!fs.existsSync(exportFile)) {
        console.error(`✗ Export file not found: ${exportFile}`);
        console.error('Available exports:');
        if (fs.existsSync(exportDir)) {
          const files = fs.readdirSync(exportDir).filter(f => f.endsWith('.json') && f.startsWith('export-'));
          files.forEach(f => console.error(`  - ${f}`));
        }
        await mongoose.connection.close();
        process.exit(1);
      }

      // Read export file
      console.log(`  Reading export file: ${exportFile}`);
      const exportData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));

      if (!exportData.collections) {
        console.error('✗ Invalid export file format - missing collections');
        await mongoose.connection.close();
        process.exit(1);
      }

      console.log(`  Export date: ${exportData.exportDate}`);
      console.log(`  Database: ${exportData.database || 'N/A'}\n`);

      // Import each collection
      for (const [collectionName, data] of Object.entries(exportData.collections)) {
        if (!collectionMap[collectionName]) {
          console.log(`  ⚠ Skipping unknown collection: ${collectionName}`);
          continue;
        }

        const Model = collectionMap[collectionName];
        
        try {
          // Clear existing data (optional - comment out if you want to merge)
          const deleteResult = await Model.deleteMany({});
          console.log(`  Cleared ${deleteResult.deletedCount} existing ${collectionName}`);

          // Insert new data
          if (data && data.length > 0) {
            // Remove _id to let MongoDB create new ones (or keep existing _id)
            const documents = data.map(doc => {
              const { _id, ...rest } = doc;
              return rest;
            });

            const result = await Model.insertMany(documents, { ordered: false });
            console.log(`  ✓ Imported ${result.length} documents to ${collectionName}`);
          } else {
            console.log(`  No data to import for ${collectionName}`);
          }
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error - try inserting one by one
            console.log(`  Handling duplicates for ${collectionName}...`);
            let successCount = 0;
            for (const doc of data) {
              try {
                const { _id, ...rest } = doc;
                await Model.create(rest);
                successCount++;
              } catch (err) {
                // Skip duplicates
              }
            }
            console.log(`  ✓ Imported ${successCount} documents to ${collectionName} (skipped duplicates)`);
          } else {
            console.error(`  ✗ Error importing ${collectionName}:`, error.message);
          }
        }
      }

      console.log('\n✓ Data import completed');
    }

    console.log('\n✓ Import completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Import failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

importDatabase();

