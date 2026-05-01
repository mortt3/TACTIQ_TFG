// Cliente para la API de IA encargada de procesar videos.
// Configurable mediante `AI_API_BASE` y `AI_API_KEY`.

let AI_API_BASE = (global as any).__AI_API_BASE || 'http://localhost:4000';
let AI_API_KEY: string | null = null;

export function setAiApiBase(url: string) {
	AI_API_BASE = url;
}

export function setAiApiKey(key: string | null) {
	AI_API_KEY = key;
}

function aiHeaders(extra: Record<string,string> = {}) {
	const h: Record<string,string> = {
		...extra,
	};
	if (AI_API_KEY) h['x-api-key'] = AI_API_KEY;
	return h;
}

// Sube un video (uri local) a la API de IA. La API debe aceptar multipart/form-data
export async function uploadVideoToAI(videoUri: string, filename = 'video.mp4') {
	try {
		const form = new FormData();
		// En Expo/React Native el archivo se envía con { uri, name, type }
		// @ts-ignore
		form.append('file', { uri: videoUri, name: filename, type: 'video/mp4' });

		const res = await fetch(`${AI_API_BASE}/upload`, {
			method: 'POST',
			headers: aiHeaders(),
			body: form as any,
		});
		if (!res.ok) throw new Error(`AI upload failed ${res.status}`);
		return await res.json();
	} catch (err) {
		console.warn('uploadVideoToAI failed', err);
		return null;
	}
}

export default {
	setAiApiBase,
	setAiApiKey,
	uploadVideoToAI,
};
