import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error("\x1b[31mUsage: node scripts/hash.mjs <your_password>\x1b[0m");
    process.exit(1);
}

const rounds = 12;
console.log(`[Security] Generating bcrypt hash with ${rounds} rounds...`);

bcrypt.hash(password, rounds, (err, hash) => {
    if (err) {
        console.error("\x1b[31mError generating hash:\x1b[0m", err);
        process.exit(1);
    }
    console.log("\x1b[32m[Success] Use the following hash in your .env as ADMIN_PASSWORD:\x1b[0m");
    console.log(hash);
});
