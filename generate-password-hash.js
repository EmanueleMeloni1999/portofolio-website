/**
 * Script per generare l'hash della password per la showreel
 *
 * Usage:
 *   node generate-password-hash.js "TuaPasswordQui"
 *
 * L'output è l'hash SHA-256 da usare nella variabile d'ambiente SHOWREEL_PASSWORD_HASH
 */

const crypto = require('crypto');

// Ottieni la password dagli argomenti
const password = process.argv[2];

if (!password) {
    console.error('❌ Errore: Devi fornire una password come argomento');
    console.log('\nUsage:');
    console.log('  node generate-password-hash.js "TuaPasswordQui"\n');
    process.exit(1);
}

// Genera hash SHA-256
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n🔐 Password Hash Generator');
console.log('═'.repeat(60));
console.log('\nPassword fornita:', password);
console.log('\nHash SHA-256:\n');
console.log('  ' + hash);
console.log('\n═'.repeat(60));
console.log('\n📝 Prossimi passi:');
console.log('\n1. Copia l\'hash sopra');
console.log('2. Vai su Vercel Dashboard → Settings → Environment Variables');
console.log('3. Aggiungi:');
console.log('   Nome: SHOWREEL_PASSWORD_HASH');
console.log('   Valore: ' + hash);
console.log('\n4. Aggiungi anche:');
console.log('   Nome: SHOWREEL_VIDEO_ID');
console.log('   Valore: yk6dA3tnU8g (o il tuo video ID)\n');
console.log('5. Fai re-deploy del progetto\n');
