const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_CONFIG = {
    host: '139.99.18.233',
    user: 'kdbcom_7k-db',
    password: 'T?409gvh3',
    database: 'kdbcom_7k-db'
};

const RESULTS_FILE = path.join(__dirname, 'hero_roles_final.txt');

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Connected.');

        if (!fs.existsSync(RESULTS_FILE)) {
            throw new Error(`Results file not found: ${RESULTS_FILE}`);
        }

        const content = fs.readFileSync(RESULTS_FILE, 'utf-8');
        const sections = content.split('--- ');
        
        let totalUpdated = 0;

        // Skip the header section (index 0)
        for (let i = 1; i < sections.length; i++) {
            const section = sections[i];
            const lines = section.split('\n');
            const header = lines[0]; // e.g. "ATTACK (34) ---"
            
            // Extract the role name
            const roleMatch = header.match(/^([A-Z]+)/);
            if (!roleMatch) continue;
            const role = roleMatch[1];
            
            // Canonical Role Name (Attack, Magic, Defense, Support, Universal)
            const dbType = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            
            console.log(`\n>>> Processing Role: ${dbType} <<<`);

            for (let j = 1; j < lines.length; j++) {
                const line = lines[j].trim();
                // Match "Name (filename.webp)"
                const filenameMatch = line.match(/\((.*?)\.webp\)/);
                if (!filenameMatch) continue;
                
                const filename = filenameMatch[1];

                if (dbType === 'Attack') {
                    // Update role to Attack and group to Physical
                    await connection.execute(
                        'UPDATE heroes SET type = ?, hero_group = ? WHERE filename = ?',
                        ['Attack', 'Physical', filename]
                    );
                    console.log(`[UPDATED] ${filename}: Role=Attack, Group=Physical`);
                } else if (dbType === 'Magic') {
                    // Update role to Magic and group to Magic
                    await connection.execute(
                        'UPDATE heroes SET type = ?, hero_group = ? WHERE filename = ?',
                        ['Magic', 'Magic', filename]
                    );
                    console.log(`[UPDATED] ${filename}: Role=Magic, Group=Magic`);
                } else {
                    // Update ONLY type (leave group as is)
                    await connection.execute(
                        'UPDATE heroes SET type = ? WHERE filename = ?',
                        [dbType, filename]
                    );
                    console.log(`[UPDATED] ${filename}: Role=${dbType} (Group kept)`);
                }
                totalUpdated++;
            }
        }

        console.log(`\n================================================`);
        console.log(`SUCCESS: Migration complete.`);
        console.log(`Total Heroes Synchronized: ${totalUpdated}`);
        console.log(`================================================`);

    } catch (err) {
        console.error('\n!!! MIGRATION ERROR !!!');
        console.error(err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
