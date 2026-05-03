// Servicio cliente para llamadas al backend que gestiona la base de datos SQL.
// Preparado para usar un `API_BASE_URL` y un token de autorización.

export type Player = {
	id: string;
	nombre: string;
	edad?: number;
	dorsal?: number;
	idPosicion?: number;
	posicion?: string;
	rolEspecifico?: string;
	foto_url?: string;
	stats?: {
		lanzados?: number;
		goles?: number;
		sanciones?: number;
		valoracion?: number;
	};
	zonas?: Array<{ zona: string; lanz: number; gol: number; ef: string }>;
};

export type Team = {
	id: string;
	nombre: string;
	logo?: string;
	ciudad?: string;
	idPabellon?: number;
};

export type MatchEvent = {
	id: string;
	minute: number;
	type: string;
	playerId?: number;
	playerName: string;
	playerNumber?: number;
};

export type CreateMatchPayload = {
	idEquipoLocal: number;
	idEquipoVisitante: number;
	fecha: string;
	hora: string;
	idTemporada?: number;
	jornada?: number;
	idPabellon?: number;
	condicion?: string;
};

let API_BASE = (global as any).__API_BASE_URL || 'https://tactiq-tfg-api.onrender.com';
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

function unwrapListResponse(data: any): any[] {
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.value)) return data.value;
	if (Array.isArray(data?.Value)) return data.Value;
	return [];
}

// Position mapping removed: the API now exposes `posicion`/`Posicion`
// which comes from the DB `posicion` table via the backend join.
// Frontend will use the `posicion` / `Posicion` / `rolEspecifico` fields from the API response.

export async function getPlayers(): Promise<Player[]> {
	try {
		const url = `${API_BASE}/api/jugadores`;
		console.log(`Fetching players from: ${url}`);
		const res = await fetch(url, { headers: headers() });
		if (!res.ok) throw new Error(`Status ${res.status}`);
		const data = await res.json();
		const rows = unwrapListResponse(data);
		// Map API response to Player type: idJugador -> id, nombreJugador -> nombre
		return rows.map((j: any) => ({
			id: j.idJugador?.toString(),
			nombre: j.nombreJugador,
			edad: j.edad ?? j.Edad,
			dorsal: j.dorsal,
			idPosicion: j.idPosicion ?? j.IdPosicion,
				posicion: j.rolEspecifico ?? j.RolEspecifico ?? j.posicion ?? j.Posicion,
				rolEspecifico: j.rolEspecifico ?? j.RolEspecifico,
			foto_url: j.imagenJugador || j.ImagenJugador || j.foto_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
		}));
	} catch (err) {
		console.warn('getPlayers failed, returning empty list', err);
		return [];
	}
}

// Fallback teams map in case API endpoint fails
const FALLBACK_TEAMS: Record<number, Team> = {
	1: { id: '1', nombre: 'Equipo 1', logo: 'https://via.placeholder.com/60' },
	2: { id: '2', nombre: 'Equipo 2', logo: 'https://via.placeholder.com/60' },
	3: { id: '3', nombre: 'Equipo 3', logo: 'https://via.placeholder.com/60' },
	5: { id: '5', nombre: 'Equipo 5', logo: 'https://via.placeholder.com/60' },
	7: { id: '7', nombre: 'Equipo 7', logo: 'https://via.placeholder.com/60' },
	8: { id: '8', nombre: 'Equipo 8', logo: 'https://via.placeholder.com/60' },
	10: { id: '10', nombre: 'Equipo 10', logo: 'https://via.placeholder.com/60' },
	11: { id: '11', nombre: 'Equipo 11', logo: 'https://via.placeholder.com/60' },
	12: { id: '12', nombre: 'Equipo 12', logo: 'https://via.placeholder.com/60' },
	13: { id: '13', nombre: 'Zaragoza', logo: 'https://via.placeholder.com/60' },
	14: { id: '14', nombre: 'Equipo 14', logo: 'https://via.placeholder.com/60' },
	15: { id: '15', nombre: 'Equipo 15', logo: 'https://via.placeholder.com/60' },
};

export async function getTeams(): Promise<Team[]> {
	try {
		const url = `${API_BASE}/api/equipos`;
		console.log(`Fetching teams from: ${url}`);
		const res = await fetch(url, { headers: headers() });
		if (!res.ok) {
			console.warn('getTeams returned status', res.status, 'using fallback');
			return Object.values(FALLBACK_TEAMS);
		}
		const data = await res.json();
		const rows = unwrapListResponse(data);
		return rows.map((t: any) => ({
			id: t.idEquipo?.toString(),
			nombre: t.nombreEquipo,
			logo: t.imagenLogo || 'https://via.placeholder.com/60',
			ciudad: t.ciudad,
			idPabellon: t.idPabellon,
		}));
	} catch (err) {
		console.warn('getTeams failed, using fallback teams', err);
		return Object.values(FALLBACK_TEAMS);
	}
}

export async function getMatches(): Promise<any[]> {
	try {
		const url = `${API_BASE}/api/partidos`;
		console.log(`Fetching matches from: ${url}`);
		const matchesRes = await fetch(url, { headers: headers() });
		if (!matchesRes.ok) throw new Error(`Status ${matchesRes.status}`);

		const matchesData = await matchesRes.json();
		const matches = unwrapListResponse(matchesData);
		
		// Try to get teams, use fallback if fails
		const teamsRes = await fetch(`${API_BASE}/api/equipos`, { headers: headers() });
		const teamsData = teamsRes.ok ? await teamsRes.json() : [];
		const teamsArray = teamsData.length > 0 ? unwrapListResponse(teamsData) : Object.values(FALLBACK_TEAMS).map((t: any) => ({
			idEquipo: Number(t.id),
			nombreEquipo: t.nombre,
			imagenLogo: t.logo,
		}));
		
		const teamMap = new Map<number, any>(
			teamsArray
				.map((t: any) => ({
					id: Number(t.idEquipo ?? t.IdEquipo),
					name: t.nombreEquipo ?? t.NombreEquipo,
					logo: t.imagenLogo ?? t.ImagenLogo,
				}))
				.filter((t: any) => Number.isFinite(t.id) && t.id > 0)
				.map((t: any) => [t.id, t])
		);

		console.log('Team map:', Array.from(teamMap.entries()));

		return matches.map((p: any) => {
			const localId = Number(p.idEquipoLocal ?? p.IdEquipoLocal);
			const rivalId = Number(p.idEquipoVisitante ?? p.IdEquipoVisitante);
			const localTeam = teamMap.get(localId);
			const rivalTeam = teamMap.get(rivalId);

			const result = {
				idPartido: p.idPartido ?? p.IdPartido,
				idEquipoLocal: localId,
				idEquipoVisitante: rivalId,
				local_nombre: localTeam?.name || p.nombreEquipoLocal || `Equipo ${localId || ''}`,
				rival_nombre: rivalTeam?.name || p.nombreEquipoVisitante || `Equipo ${rivalId || ''}`,
				nombreEquipoLocal: localTeam?.name || p.nombreEquipoLocal || `Equipo ${localId || ''}`,
				nombreEquipoVisitante: rivalTeam?.name || p.nombreEquipoVisitante || `Equipo ${rivalId || ''}`,
				local_logo: localTeam?.logo || p.local_logo || p.imagenLogoLocal || 'https://via.placeholder.com/50',
				rival_logo: rivalTeam?.logo || p.rival_logo || p.imagenLogoVisitante || 'https://via.placeholder.com/50',
				fecha: p.fecha,
				hora: p.hora,
				golesLocal: p.golesLocal ?? p.GolesLocal ?? 0,
				golesVisitante: p.golesVisitante ?? p.GolesVisitante ?? 0,
				condicion: p.condicion,
			};
			console.log('Match result:', result);
			return result;
		});
	} catch (err) {
		console.warn('getMatches failed, returning empty list', err);
		return [];
	}
}

export async function getPlayer(id: string): Promise<Player | null> {
	try {
		const baseUrl = `${API_BASE}/api/jugadores/${id}`;
		const statsUrl = `${API_BASE}/api/jugadores/${id}/estadisticas-temporada`;
		console.log(`Fetching player from: ${baseUrl}`);

		const [baseRes, statsRes, listRes] = await Promise.all([
			fetch(baseUrl, { headers: headers() }),
			fetch(statsUrl, { headers: headers() }),
			fetch(`${API_BASE}/api/jugadores`, { headers: headers() }),
		]);

		const listData = listRes.ok ? unwrapListResponse(await listRes.json()) : [];
		const listPlayer = listData.find((j: any) => String(j.idJugador ?? j.IdJugador) === String(id));

		let j: any = null;
		if (baseRes.ok) {
			j = await baseRes.json();
		} else if (listPlayer) {
			j = listPlayer;
		} else {
			console.warn('getPlayer returned status', baseRes.status);
			return null;
		}

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
			edad: j.edad ?? j.Edad,
			dorsal: j.dorsal ?? j.Dorsal,
			idPosicion: j.idPosicion ?? j.IdPosicion,
			posicion: j.rolEspecifico ?? j.RolEspecifico ?? j.posicion ?? j.Posicion,
			rolEspecifico: j.rolEspecifico ?? j.RolEspecifico,
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

export async function addMatch(payload: CreateMatchPayload): Promise<any | null> {
	try {
		const url = `${API_BASE}/api/partidos`;
		console.log(`Adding match to: ${url}`, payload);
		const res = await fetch(url, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify({
				idEquipoLocal: payload.idEquipoLocal,
				idEquipoVisitante: payload.idEquipoVisitante,
				fecha: payload.fecha,
				hora: payload.hora,
				idTemporada: payload.idTemporada,
				jornada: payload.jornada,
				idPabellon: payload.idPabellon,
				condicion: payload.condicion,
			}),
		});

		if (!res.ok) throw new Error(`Status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.warn('addMatch failed', err);
		return null;
	}
}

export async function getMatch(matchId: string): Promise<any | null> {
	try {
		const url = `${API_BASE}/api/partidos/${matchId}`;
		console.log(`Fetching match from: ${url}`);
		const [res, matchesRes, teamsRes] = await Promise.all([
			fetch(url, { headers: headers() }),
			fetch(`${API_BASE}/api/partidos`, { headers: headers() }),
			fetch(`${API_BASE}/api/equipos`, { headers: headers() }),
		]);

		const matchesData = matchesRes.ok ? unwrapListResponse(await matchesRes.json()) : [];
		const fallbackMatch = matchesData.find((m: any) => String(m.idPartido ?? m.IdPartido) === String(matchId));
		const teamsData = teamsRes.ok ? unwrapListResponse(await teamsRes.json()) : [];
		const teamMap = new Map<number, any>(
			teamsData
				.map((t: any) => ({
					id: Number(t.idEquipo ?? t.IdEquipo),
					name: t.nombreEquipo ?? t.NombreEquipo,
					logo: t.imagenLogo ?? t.ImagenLogo,
				}))
				.filter((t: any) => Number.isFinite(t.id) && t.id > 0)
				.map((t: any) => [t.id, t])
		);

		let j: any = null;
		if (res.ok) {
			j = await res.json();
		} else if (fallbackMatch) {
			j = {
				idPartido: fallbackMatch.idPartido ?? fallbackMatch.IdPartido ?? Number(matchId),
				jornada: fallbackMatch.jornada ?? fallbackMatch.Jornada,
				fecha: fallbackMatch.fecha ?? fallbackMatch.Fecha,
				hora: fallbackMatch.hora ?? fallbackMatch.Hora,
				pabellon: fallbackMatch.pabellon ?? fallbackMatch.NombrePabellon,
				equipoLocal: {
					id: fallbackMatch.idEquipoLocal,
					nombre: fallbackMatch.local_nombre,
					goles: fallbackMatch.golesLocal,
					imagenLogo: teamMap.get(Number(fallbackMatch.idEquipoLocal))?.logo || fallbackMatch.local_logo,
				},
				equipoVisitante: {
					id: fallbackMatch.idEquipoVisitante,
					nombre: fallbackMatch.rival_nombre,
					goles: fallbackMatch.golesVisitante,
					imagenLogo: teamMap.get(Number(fallbackMatch.idEquipoVisitante))?.logo || fallbackMatch.rival_logo,
				},
				estadisticasJugadores: [],
				condicion: fallbackMatch.condicion,
			};
		} else {
			console.warn('getMatch returned status', res.status);
			return null;
		}
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
	getTeams,
	getMatches,
	getPlayer,
	getMatch,
	addEvent,
	addMatch,
	login,
};
