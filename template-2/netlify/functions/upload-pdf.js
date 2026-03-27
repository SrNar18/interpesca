const crypto = require('node:crypto');
const { getStore } = require('@netlify/blobs');

const MAX_SIZE_BYTES = 3 * 1024 * 1024;

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

function validateToken(token) {
  const secret = process.env.ADMIN_SECRET || '';
  if (!token || !secret) return false;

  try {
    const [payloadB64, sig] = token.split('.');
    if (!payloadB64 || !sig) return false;

    const payload = Buffer.from(payloadB64, 'base64').toString();
    const timestamp = parseInt(payload, 10);

    if (isNaN(timestamp)) return false;

    if (Date.now() - timestamp > 4 * 60 * 60 * 1000) return false;

    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return sig === expected;

  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Método no permitido' });
    }

    const auth = event.headers.authorization || '';
    const token = auth.replace('Bearer ', '');

    if (!validateToken(token)) {
      return json(401, { error: 'No autorizado' });
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'JSON inválido' });
    }

    const base64 = body.data;

    if (!base64) {
      return json(400, { error: 'No se recibió archivo' });
    }

    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length === 0) {
      return json(400, { error: 'Archivo vacío' });
    }

    if (buffer.length > MAX_SIZE_BYTES) {
      return json(400, { error: 'Archivo demasiado grande (max 3MB)' });
    }

    // Validación PDF real
    if (buffer.toString('utf8', 0, 5) !== '%PDF-') {
      return json(400, { error: 'No es un PDF válido' });
    }

    const store = getStore({ name: 'pdfs' });

    await store.set('catalogo.pdf', buffer, {
      metadata: {
        contentType: 'application/pdf'
      }
    });

    return json(200, {
      success: true,
      message: 'PDF actualizado'
    });

  } catch (err) {
    console.error(err);
    return json(500, { error: 'Error interno' });
  }
};