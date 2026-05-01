// Servicio cliente para llamadas al backend que gestiona la base de datos SQL.
// Preparado para usar un `API_BASE_URL` y un token de autorización.

export type Player = {
	id: string;
	nombre: string;
	dorsal?: number;
	foto_url?: string;
};

export type MatchEvent = {
	id: string;
	minute: number;
	type: string;
	playerName: string;
	playerNumber?: number;
};

let API_BASE = (global as any).__API_BASE_URL || 'http://localhost:5268';
let authToken: string | null = null;

export function setApiBase(url: string) {
	API_BASE = url;
	console.log(`API Base URL set to: ${url}`);
}

export function setAuthToken(token: string | null) {
	authToken = token;
}

function headers(extra: Record<string,string> = {}) {
	const h: Record<string,string> = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		...extra,
	};
	if (authToken) h['Authorization'] = `Bearer ${authToken}`;
	return h;
}

export async function getPlayers(): Promise<Player[]> {
	try {
		const url = `${API_BASE}/api/jugadores`;
		console.log(`Fetching players from: ${url}`);
		const res = await fetch(url, { headers: headers() });
		if (!res.ok) throw new Error(`Status ${res.status}`);
		const data = await res.json();
		// Map API response to Player type: idJugador -> id, nombreJugador -> nombre
		return data.map((j: any) => ({
			id: j.idJugador?.toString(),
			nombre: j.nombreJugador,
			dorsal: j.dorsal,
			foto_url: j.imagenJugador || j.ImagenJugador || j.foto_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
		}));
	} catch (err) {
		console.warn('getPlayers failed, returning empty list', err);
		return [];
	}
}

export async function getPlayer(id: string): Promise<Player | null> {
	try {
		const url = `${API_BASE}/api/jugadores/${id}`;
		console.log(`Fetching player from: ${url}`);
		const res = await fetch(url, { headers: headers() });
		if (!res.ok) return null;
		const j = await res.json();
		// Map response to Player type (include foto_url)
		return {
			id: j.idJugador?.toString(),
			nombre: j.nombreJugador,
			dorsal: j.dorsal,
			foto_url: j.imagenJugador || j.ImagenJugador || j.foto_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
		};
	} catch (err) {
		console.warn('getPlayer failed', err);
		return null;
	}
}

export async function addEvent(matchId: string, event: Omit<MatchEvent, 'id'>): Promise<MatchEvent | null> {
	try {
		const url = `${API_BASE}/api/partidos/${matchId}/eventos`;
		console.log(`Adding event to: ${url}`, event);
		const res = await fetch(url, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify(event),
		});
		if (!res.ok) throw new Error(`Status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.warn('addEvent failed', err);
		return null;
	}
}

export async function login(email: string, password: string): Promise<{ token: string; userId: string } | null> {
	try {
		const url = `${API_BASE}/api/auth/login`;
		console.log(`Logging in to: ${url}`);
		const res = await fetch(url, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify({ email, password }),
		});
		if (!res.ok) throw new Error(`Status ${res.status}`);
		const data = await res.json();
		// Store token and return user info
		if (data.data?.token) {
			setAuthToken(data.data.token);
		}
		return data.data;
	} catch (err) {
		console.warn('login failed', err);
		return null;
	}
}

// Exports utility so app can configure base url and auth token at runtime.
export default {
	setApiBase,
	setAuthToken,
	getPlayers,
	getPlayer,
	addEvent,
	login,
};
