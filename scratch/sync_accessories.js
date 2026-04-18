const mysql = require('mysql2/promise');

async function syncAccessories() {
    const pool = mysql.createPool({
        host: '139.99.18.233',
        user: 'kdbcom_7k-db',
        password: 'T?409gvh3',
        database: 'kdbcom_7k-db'
    });

    const accessories = [
        { name: 'Accuracy Accessory', image: 'c_accuracy.webp' },
        { name: 'Concentration Accessory', image: 'c_concentration.webp' },
        { name: 'Defend Accessory', image: 'c_defend.webp' },
        { name: 'Fortune Accessory', image: 'c_fortune.webp' },
        { name: 'Nature Accessory', image: 'c_nature.webp' },
        { name: 'Protection Accessory', image: 'c_protection.webp' },
        { name: 'Resistance Accessory', image: 'c_resistance.webp' },
        { name: 'Vengeance Accessory', image: 'c_vengeance.webp' },
        { name: 'Authority Accessory', image: 'l_authority.webp' },
        { name: 'Immortality Accessory', image: 'l_immortality.webp' },
        { name: 'Resurrection Accessory', image: 'l_resurrection.webp' },
        { name: 'Annihilation Accessory', image: 'r_annihilation.webp' },
        { name: 'Bulwark Accessory', image: 'r_bulwark.webp' },
        { name: 'Health Accessory', image: 'r_health.webp' },
        { name: 'Roar Accessory', image: 'r_roar.webp' },
        { name: 'Siege Accessory', image: 'r_siege.webp' },
        { name: 'Subjugation Accessory', image: 'r_subjugation.webp' },
        { name: 'Tenacity Accessory', image: 'r_tenacity.webp' },
        { name: 'Brilliance Accessory', image: 'un_brilliance.webp' },
        { name: 'Chance Accessory', image: 'un_chance.webp' },
        { name: 'Curses Accessory', image: 'un_curses.webp' },
        { name: 'Death Accessory', image: 'un_death.webp' },
        { name: 'Doom Accessory', image: 'un_doom.webp' },
        { name: 'Dreams Accessory', image: 'un_dreams.webp' },
        { name: 'Horror Accessory', image: 'un_horror.webp' },
        { name: 'Magic Accessory', image: 'un_magic.webp' },
        { name: 'Medusa Accessory', image: 'un_medusa.webp' },
        { name: 'Salamander Accessory', image: 'un_salamander.webp' },
        { name: 'Snow Accessory', image: 'un_snow.webp' },
        { name: 'Thorns Accessory', image: 'un_thorns.webp' },
        { name: 'Time Accessory', image: 'un_time.webp' },
        { name: 'Viper Accessory', image: 'un_viper.webp' }
    ];

    console.log(`Starting sync of ${accessories.length} accessories...`);

    for (const acc of accessories) {
        try {
            // Check if exists
            const [existing] = await pool.query('SELECT id FROM items WHERE image = ?', [acc.image]);
            if (existing.length === 0) {
                await pool.query(
                    'INSERT INTO items (name, item_type, image, created_at) VALUES (?, ?, ?, NOW())',
                    [acc.name, 'Accessory', acc.image]
                );
                console.log(`Inserted: ${acc.name}`);
            } else {
                console.log(`Skipped (exists): ${acc.name}`);
            }
        } catch (e) {
            console.error(`Error processing ${acc.name}:`, e.message);
        }
    }

    console.log('Sync complete.');
    process.exit(0);
}

syncAccessories();
