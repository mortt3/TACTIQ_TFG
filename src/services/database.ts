// Servicio cliente para llamadas al backend que gestiona la base de datos SQL.
// Preparado para usar un `API_BASE_URL` y un token de autorización.

export type Player = {
	id: string;
	nombre: string;
	dorsal?: number;
};

export type MatchEvent = {
	id: string;
	minute: number;
	type: string;
	playerName: string;
	playerNumber?: number;
};

let API_BASE = (global as any).__API_BASE_URL || 'http://localhost:3000';
let authToken: string | null = null;

export function setApiBase(url: string) {
	API_BASE = url;
}

export function setAuthToken(token: string | null) {
	authToken = token;
}

function headers(extra: Record<string,string> = {}) {
	const h: Record<string,string> = {
		'Accept': 'application/json',
		...extra,
	};
	if (authToken) h['Authorization'] = `Bearer ${authToken}`;
	return h;
}

export async function getPlayers(): Promise<Player[]> {
	try {
		const res = await fetch(`${API_BASE}/api/players`, { headers: headers() });
		if (!res.ok) throw new Error(`Status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.warn('getPlayers failed, returning empty list', err);
		return [];
	}
}

export async function getPlayer(id: string): Promise<Player | null> {
	try {
		const res = await fetch(`${API_BASE}/api/players/${id}`, { headers: headers() });
		if (!res.ok) return null;
		return await res.json();
	} catch (err) {
		console.warn('getPlayer failed', err);
		return null;
	}
}

export async function addEvent(matchId: string, event: Omit<MatchEvent, 'id'>): Promise<MatchEvent | null> {
	try {
		const res = await fetch(`${API_BASE}/api/matches/${matchId}/events`, {
			method: 'POST',
			headers: headers({ 'Content-Type': 'application/json' }),
			body: JSON.stringify(event),
		});
		if (!res.ok) throw new Error(`Status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.warn('addEvent failed', err);
		return null;
	}
}

export async function createPlayer(player: Partial<Player>): Promise<Player | null> {
	try {
		const res = await fetch(`${API_BASE}/api/players`, {
			method: 'POST',
			headers: headers({ 'Content-Type': 'application/json' }),
			body: JSON.stringify(player),
		});
		if (!res.ok) throw new Error(`Status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.warn('createPlayer failed', err);
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
	createPlayer,
};
