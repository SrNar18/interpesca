import crypto from 'node:crypto';

function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Petición inválida' }, { status: 400 });
    }

    const { username, password } = body;
    const expectedUser = process.env.ADMIN_USER     || '';
    const expectedPass = process.env.ADMIN_PASSWORD || '';
    const secret       = process.env.ADMIN_SECRET   || '';

    if (!expectedUser || !expectedPass || !secret) {
        return Response.json(
            { error: 'Servidor no configurado. Añade ADMIN_USER, ADMIN_PASSWORD y ADMIN_SECRET en las variables de entorno de Netlify.' },
            { status: 500 }
        );
    }

    const valid = safeEqual(String(username || ''), expectedUser)
               && safeEqual(String(password || ''), expectedPass);

    if (!valid) {
        await new Promise(r => setTimeout(r, 800));
        return Response.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }

    const payload = Date.now().toString();
    const sig     = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token   = Buffer.from(payload).toString('base64') + '.' + sig;

    return Response.json({ token });
};
