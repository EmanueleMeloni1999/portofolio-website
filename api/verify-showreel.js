/**
 * Serverless function per verificare la password della showreel
 * Deploy: Vercel Serverless Functions
 */

// Importa crypto per hashing (built-in Node.js)
const crypto = require('crypto');

// Rate limiting in-memory (reset ad ogni deploy, ma sufficiente per uso base)
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minuti

/**
 * Hash della password usando SHA-256
 * @param {string} password
 * @returns {string} hash
 */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verifica rate limiting per IP
 * @param {string} ip
 * @returns {boolean} true se può procedere
 */
function checkRateLimit(ip) {
    const now = Date.now();
    const userAttempts = attempts.get(ip) || { count: 0, firstAttempt: now };

    // Reset se è passato il tempo limite
    if (now - userAttempts.firstAttempt > RATE_LIMIT_WINDOW) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    // Incrementa tentativi
    userAttempts.count++;
    attempts.set(ip, userAttempts);

    return userAttempts.count <= MAX_ATTEMPTS;
}

/**
 * Genera un token JWT-like semplice (per demo, non usare in produzione critica)
 * @returns {string} token
 */
function generateToken() {
    const payload = {
        authorized: true,
        timestamp: Date.now(),
        expires: Date.now() + (60 * 60 * 1000) // 1 ora
    };

    // In produzione usare libreria JWT reale
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    return token;
}

/**
 * Handler principale della serverless function
 */
module.exports = async (req, res) => {
    // CORS Headers - permetti solo il tuo dominio in produzione
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // In produzione: 'https://tuodominio.com'
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo POST permesso
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // Ottieni IP per rate limiting
        const ip = req.headers['x-forwarded-for'] ||
                   req.headers['x-real-ip'] ||
                   req.connection.remoteAddress ||
                   'unknown';

        // Rate limiting check
        if (!checkRateLimit(ip)) {
            console.log(`Rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({
                success: false,
                error: 'Too many attempts. Please try again later.'
            });
        }

        // Estrai password dal body
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                error: 'Password is required'
            });
        }

        // Hash della password ricevuta
        const hashedInput = hashPassword(password);

        // Password corretta (hash pre-calcolato)
        // Per generare: node -e "console.log(require('crypto').createHash('sha256').update('TuaPasswordQui').digest('hex'))"
        const CORRECT_PASSWORD_HASH = process.env.SHOWREEL_PASSWORD_HASH;

        if (!CORRECT_PASSWORD_HASH) {
            console.error('SHOWREEL_PASSWORD_HASH non configurato nelle variabili d\'ambiente');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error'
            });
        }

        // Verifica password
        if (hashedInput === CORRECT_PASSWORD_HASH) {
            // Password corretta - genera token e restituisci video ID
            const token = generateToken();
            const videoId = process.env.SHOWREEL_VIDEO_ID || 'yk6dA3tnU8g';

            console.log(`Accesso autorizzato da IP: ${ip}`);

            return res.status(200).json({
                success: true,
                token: token,
                videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
            });
        } else {
            // Password errata
            console.log(`Tentativo fallito da IP: ${ip}`);
            return res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
        }

    } catch (error) {
        console.error('Error in verify-showreel:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
