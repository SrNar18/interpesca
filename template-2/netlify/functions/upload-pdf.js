import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB

function validateToken(token) {
    const secret = process.env.ADMIN_SECRET || '';
    if (!token || !secret) return false;
    try {
        const [payloadB64, sig] = token.split('.');
        if (!payloadB64 || !sig) return false;
        const payload   = Buffer.from(payloadB64, 'base64').toString();
        const timestamp = parseInt(payload, 10);
        if (isNaN(timestamp)) return false;
        if (Date.now() - timestamp > 4 * 60 * 60 * 1000) return false;
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        if (sig.length !== expected.length) return false;
        return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch { return false; }
}

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const auth  = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
        return Response.json({ error: 'No autorizado. Inicia sesión de nuevo.' }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Petición inválida' }, { status: 400 });
    }

    const { data } = body;

    let pdfBuffer;
    try {
        pdfBuffer = Buffer.from(data, 'base64');
    } catch {
        return Response.json({ error: 'Datos de archivo inválidos' }, { status: 400 });
    }

    if (pdfBuffer.length === 0 || pdfBuffer.length > MAX_SIZE_BYTES) {
        return Response.json(
            { error: `El archivo debe tener entre 1 byte y ${MAX_SIZE_BYTES / 1024 / 1024} MB` },
            { status: 400 }
        );
    }

    if (pdfBuffer.toString('utf8', 0, 5) !== '%PDF-') {
        return Response.json({ error: 'No es un PDF válido' }, { status: 400 });
    }

    const store = getStore({ name: 'pdfs', consistency: 'strong' });
    await store.set('catalogo', pdfBuffer, {
        metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
    });

    return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });
};
