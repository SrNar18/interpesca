export default async (req) => {
    try {
        const { getStore } = await import('@netlify/blobs');
        const store = getStore({ name: 'pdfs', consistency: 'strong' });
        const blob  = await store.get('catalogo', { type: 'arrayBuffer' });

        if (blob && blob.byteLength > 0) {
            return new Response(Buffer.from(blob), {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="catalogo.pdf"',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }
    } catch {}

    return new Response('PDF no disponible', { status: 404 });
};
