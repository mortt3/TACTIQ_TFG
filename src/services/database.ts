// Servicio cliente para llamadas al backend que gestiona la base de datos SQL.
// Preparado para usar un `API_BASE_URL` y un token de autorización.

export type Player = {
	id: string;
	nombre: string;
	dorsal?: number;
	posicion?: string;
	foto_url?: string;
	stats?: {
		lanzados?: number;
		goles?: number;
		sanciones?: number;
		valoracion?: number;
	};
	zonas?: Array<{ zona: string; lanz: number; gol: number; ef: string }>;
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
			posicion: j.rolEspecifico || j.RolEspecifico || j.posicion || j.Posicion,
			foto_url: j.imagenJugador || j.ImagenJugador || j.foto_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
		}));
	} catch (err) {
		console.warn('getPlayers failed, returning empty list', err);
		return [];
	}
}

export async function getPlayer(id: string): Promise<Player | null> {
	try {
		const baseUrl = `${API_BASE}/api/jugadores/${id}`;
		const statsUrl = `${API_BASE}/api/jugadores/${id}/estadisticas-temporada`;
		console.log(`Fetching player from: ${baseUrl}`);

		const [baseRes, statsRes] = await Promise.all([
			fetch(baseUrl, { headers: headers() }),
			fetch(statsUrl, { headers: headers() }),
		]);

		if (!baseRes.ok) return null;
		const j = await baseRes.json();

		const statsPayload = statsRes.ok ? await statsRes.json() : null;
		const totalLanzamientos = Number(statsPayload?.totalLanzamientos ?? 0);
		const totalGoles = Number(statsPayload?.totalGoles ?? 0);
		const totalSanciones =
			Number(statsPayload?.sanciones2Mins ?? 0) +
			Number(statsPayload?.sancionesRojas ?? 0) +
			Number(statsPayload?.sancionesAmarillas ?? 0);

		const zoneRows = [
			{ zona: '9m', lanz: Number(statsPayload?.m9Lanz ?? 0), gol: Number(statsPayload?.m9Goles ?? 0) },
			{ zona: 'Extremo', lanz: Number(statsPayload?.extLanz ?? 0), gol: Number(statsPayload?.extGoles ?? 0) },
			{ zona: '6m', lanz: Number(statsPayload?.m6Lanz ?? 0), gol: Number(statsPayload?.m6Goles ?? 0) },
			{ zona: '7m', lanz: Number(statsPayload?.m7Lanz ?? 0), gol: Number(statsPayload?.m7Goles ?? 0) },
		].map((row) => ({
			...row,
			ef: row.lanz > 0 ? `${Math.round((row.gol / row.lanz) * 100)}%` : '0%',
		}));

		return {
			id: (j.idJugador ?? j.IdJugador)?.toString(),
			nombre: j.nombreJugador ?? j.NombreJugador,
			dorsal: j.dorsal ?? j.Dorsal,
			posicion: j.rolEspecifico ?? j.RolEspecifico ?? j.posicion ?? j.Posicion,
			foto_url: j.imagenJugador || j.ImagenJugador || j.foto_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
			stats: {
				lanzados: totalLanzamientos,
				goles: totalGoles,
				sanciones: totalSanciones,
				valoracion: Number(statsPayload?.valoracionTotal ?? statsPayload?.porcentajeGol ?? 0),
			},
			zonas: zoneRows,
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

export async function getMatch(matchId: string): Promise<any | null> {
	try {
		const url = `${API_BASE}/api/partidos/${matchId}`;
		console.log(`Fetching match from: ${url}`);
		const res = await fetch(url, { headers: headers() });
		if (!res.ok) {
			console.warn('getMatch returned status', res.status);
			return null;
		}
		const j = await res.json();
		// Map response to match object
		// Note: Detail endpoint returns equipoLocal/equipoVisitante with id, nombre, goles, imagenLogo
		return {
			id: j.idPartido,
			jornada: j.jornada,
			fecha: j.fecha,
			hora: j.hora,
			pabellon: j.pabellon,
			equipoLocal: j.equipoLocal || {},
			equipoVisitante: j.equipoVisitante || {},
			score_local: j.equipoLocal?.goles ?? null,
			score_rival: j.equipoVisitante?.goles ?? null,
			condicion: j.condicion,
			estadisticasJugadores: j.estadisticasJugadores || [],
		};
	} catch (err) {
		console.warn('getMatch failed', err);
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
	getMatch,
	addEvent,
	login,
};
