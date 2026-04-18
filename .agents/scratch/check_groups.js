const mysql = require('mysql2/promise');

async function checkGroups() {
    try {
        const connection = await mysql.createConnection({
            host: '139.99.18.233',
            user: 'kdbcom_7k-db',
            password: 'T?409gvh3',
            database: 'kdbcom_7k-db'
        });
        const [rows] = await connection.execute('SELECT DISTINCT hero_group FROM heroes');
        console.log('Current Hero Groups:', rows.map(r => r.hero_group));
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkGroups();
