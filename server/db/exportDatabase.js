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
 * Export database structure and/or data
 * Usage: 
 *   node db/exportDatabase.js              # Export schema + data (default)
 *   node db/exportDatabase.js --schema    # Export schema only
 *   node db/exportDatabase.js --data       # Export data only
 *   node db/exportDatabase.js --full       # Export schema + data (same as default)
 */
const exportDatabase = async () => {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const exportSchema = args.includes('--schema') || args.includes('--full') || args.length === 0;
    const exportData = args.includes('--data') || args.includes('--full') || args.length === 0;
    const schemaOnly = args.includes('--schema') && !args.includes('--data') && !args.includes('--full');
    const dataOnly = args.includes('--data') && !args.includes('--schema') && !args.includes('--full');

    if (schemaOnly) {
      console.log('📋 Export mode: Schema only\n');
    } else if (dataOnly) {
      console.log('💾 Export mode: Data only\n');
    } else {
      console.log('📦 Export mode: Schema + Data (Full)\n');
    }

    // Connect to database
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Create export directory
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Define all collections to export
    // Note: Collection names are pluralized by Mongoose (Hero -> heroes, etc.)
    const collections = [
      { name: 'heroes', model: Hero },
      { name: 'abouts', model: About },
      { name: 'services', model: Service },
      { name: 'educations', model: Education },
      { name: 'projects', model: Project },
      { name: 'projectimages', model: ProjectImage },
      { name: 'adminusers', model: AdminUser },
      { name: 'messages', model: Message },
      { name: 'feedbacks', model: Feedback },
      { name: 'cvs', model: CV },
    ];

    // Export database structure (schemas)
    if (exportSchema) {
      console.log('📋 Exporting database structure...');
      const structure = {
        exportDate: new Date().toISOString(),
        database: mongoose.connection.name,
        schemas: {},
      };

      for (const collection of collections) {
        try {
          const schema = collection.model.schema;
          const schemaObj = {};
          
          // Extract schema paths
          schema.eachPath((pathName, schemaType) => {
            schemaObj[pathName] = {
              type: schemaType.instance,
              required: schemaType.isRequired || false,
              default: schemaType.defaultValue,
              enum: schemaType.enumValues || null,
            };
          });

          structure.schemas[collection.name] = {
            modelName: collection.model.modelName,
            schema: schemaObj,
          };
          console.log(`  ✓ Exported schema for ${collection.name}`);
        } catch (error) {
          console.error(`  ✗ Error exporting schema for ${collection.name}:`, error.message);
        }
      }

      const structureFile = path.join(exportDir, 'database-structure.json');
      fs.writeFileSync(structureFile, JSON.stringify(structure, null, 2), 'utf8');
      console.log(`\n✓ Database structure saved to: ${structureFile}\n`);
    }

    // Export database data
    if (exportData) {
      console.log('💾 Exporting database data...');
      const exportDataObj = {
        exportDate: new Date().toISOString(),
        database: mongoose.connection.name,
        collections: {},
      };

      // Export each collection
      for (const collection of collections) {
        try {
          const data = await collection.model.find({}).lean();
          exportDataObj.collections[collection.name] = data;
          console.log(`  ✓ Exported ${collection.name}: ${data.length} documents`);
        } catch (error) {
          console.error(`  ✗ Error exporting ${collection.name}:`, error.message);
          exportDataObj.collections[collection.name] = [];
        }
      }

      // Save export to JSON file
      const exportFile = path.join(exportDir, `export-${timestamp}.json`);
      fs.writeFileSync(exportFile, JSON.stringify(exportDataObj, null, 2), 'utf8');
      console.log(`\n✓ Database data exported to: ${exportFile}`);

      // Also create a latest.json for easy access
      const latestFile = path.join(exportDir, 'latest.json');
      fs.writeFileSync(latestFile, JSON.stringify(exportDataObj, null, 2), 'utf8');
      console.log(`✓ Latest data export saved to: ${latestFile}`);
    }

    console.log('\n✓ Export completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Export failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

exportDatabase();

