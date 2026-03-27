import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB reales

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

function validateToken(token) {
  const secret = process.env.ADMIN_SECRET || '';
  if (!token || !secret) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payloadB64, sig] = parts;
    const payload = Buffer.from(payloadB64, 'base64').toString('utf8');
    const timestamp = Number.parseInt(payload, 10);

    if (!Number.isFinite(timestamp)) return false;

    const age = Date.now() - timestamp;
    if (age < 0 || age > 4 * 60 * 60 * 1000) {
      return false;
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (sig.length !== expected.length) return false;

    return crypto.timingSafeEqual(
      Buffer.from(sig, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch {
    return false;
  }
}

function isProbablyPdf(buffer) {
  if (!buffer || buffer.length < 5) return false;
  return buffer.subarray(0, 5).toString('utf8') === '%PDF-';
}

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const auth =
      event.headers.authorization ||
      event.headers.Authorization ||
      '';

    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
      return json(401, { error: 'No autorizado. Inicia sesión de nuevo.' });
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Petición inválida: JSON incorrecto.' });
    }

    const { data } = body;

    if (typeof data !== 'string' || !data.trim()) {
      return json(400, { error: 'No se recibió ningún archivo en base64.' });
    }

    let pdfBuffer;
    try {
      pdfBuffer = Buffer.from(data, 'base64');
    } catch {
      return json(400, { error: 'Datos de archivo inválidos.' });
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return json(400, { error: 'El archivo está vacío.' });
    }

    if (pdfBuffer.length > MAX_SIZE_BYTES) {
      return json(400, {
        error: `El archivo supera el límite de ${MAX_SIZE_BYTES / 1024 / 1024} MB.`
      });
    }

    if (!isProbablyPdf(pdfBuffer)) {
      return json(400, { error: 'El archivo recibido no parece ser un PDF válido.' });
    }

    const store = getStore({
      name: 'pdfs',
      consistency: 'strong'
    });

    await store.set('catalogo.pdf', pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
        uploadedAt: new Date().toISOString()
      }
    });

    return json(200, {
      success: true,
      message: 'PDF subido y actualizado correctamente.'
    });
  } catch (error) {
    console.error('upload-pdf error:', error);

    return json(500, {
      error: 'Error interno al subir el PDF.'
    });
  }
}