// src/consts/matches.ts

// MOCK DATA: Simulando lo que nos devolvería la base de datos (Equipos + Partidos)
const mockMatches = [
  {
    id_partido: 1,
    local_nombre: 'Balonmano Zaragoza',
    rival_nombre: 'Barça Atlètic',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805477.png',
    status: 'future',
    fecha: new Date('2026-04-15T18:00:00'),
  },
  {
    id_partido: 2,
    local_nombre: 'Balonmano Zaragoza',
    rival_nombre: 'Fraikin BM. Granollers',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805481.png',
    status: 'next',
    fecha: new Date('2026-03-14T12:30:00'),
  },
  {
    id_partido: 3,
    local_nombre: 'Balonmano Zaragoza',
    rival_nombre: 'Bidasoa Irun',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805488.png',
    status: 'played',
    fecha: new Date('2026-03-01T18:00:00'),
    score_local: 34,
    score_rival: 23,
  },
  {
    id_partido: 4,
    local_nombre: 'Balonmano Zaragoza',
    rival_nombre: 'Abanca Ademar León',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805494.png',
    status: 'played',
    fecha: new Date('2026-02-23T18:00:00'),
    score_local: 32,
    score_rival: 37,
  }
];

export default mockMatches;