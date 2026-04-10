require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Generar token seguro
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Middleware de autenticación
function requireAuth(req, res) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No autorizado' }));
        return false;
    }
    
    const token = authHeader.substring(7);
    
    // Verificar si el token es válido (en producción usarías una base de datos)
    const validTokens = JSON.parse(process.env.ADMIN_TOKENS || '[]');
    
    if (!validTokens.includes(token)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Token inválido' }));
        return false;
    }
    
    return true;
}

// Parsear body de requests
function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve({});
            }
        });
    });
}

// Endpoint de login
async function handleLogin(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Método no permitido' }));
        return;
    }
    
    try {
        const { password } = await parseBody(req);
        
        if (password === process.env.ADMIN_PASSWORD) {
            const token = generateToken();
            
            // Guardar token (en producción usarías Redis o base de datos)
            const existingTokens = JSON.parse(process.env.ADMIN_TOKENS || '[]');
            existingTokens.push(token);
            
            // Limitar a 10 tokens activos
            if (existingTokens.length > 10) {
                existingTokens.shift();
            }
            
            process.env.ADMIN_TOKENS = JSON.stringify(existingTokens);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                token,
                message: 'Login exitoso'
            }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: 'Contraseña incorrecta' 
            }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error del servidor' }));
    }
}

// Endpoint de logout
async function handleLogout(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Método no permitido' }));
        return;
    }
    
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            
            // Remover token de la lista
            const existingTokens = JSON.parse(process.env.ADMIN_TOKENS || '[]');
            const filteredTokens = existingTokens.filter(t => t !== token);
            process.env.ADMIN_TOKENS = JSON.stringify(filteredTokens);
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Logout exitoso' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error del servidor' }));
    }
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API Routes
    if (pathname === '/api/login' && req.method === 'POST') {
        await handleLogin(req, res);
        return;
    }

    if (pathname === '/api/logout' && req.method === 'POST') {
        await handleLogout(req, res);
        return;
    }

    // Proteger archivos de administración
    if (pathname.startsWith('/admin') || pathname.includes('admin')) {
        // Permitir acceso al login sin autenticación
        if (pathname === '/admin-login.html' || pathname === '/admin-login') {
            // Servir archivo de login
        } else {
            // Requerir autenticación para otros archivos admin
            if (!requireAuth(req, res)) {
                return;
            }
        }
    }

    // Servir archivos estáticos
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔐 Sistema de autenticación activado`);
    console.log(`📦 API endpoints disponibles:`);
    console.log(`   POST /api/login - Iniciar sesión`);
    console.log(`   POST /api/logout - Cerrar sesión`);
});
