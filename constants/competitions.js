const competitions = [
  {
    id: 1,
    name: 'National Shooting Championship 2026',
    from_date: '2026-11-12',
    to_date: '2026-11-18',
    level: 'National',
    venue: 'Dr. Karni Singh Shooting Range, New Delhi',
    description:
      'Premier national-level championship featuring rifle, pistol and shotgun disciplines for elite athletes.',
    events: [
      {
        id: 101,
        name: '10m Air Rifle Men',
        date: '2026-11-13',
        scoring: 'ISSF Electronic Scoring',
      },
      {
        id: 102,
        name: '10m Air Pistol Women',
        date: '2026-11-14',
        scoring: 'ISSF Electronic Scoring',
      },
      {
        id: 103,
        name: '50m Rifle 3 Positions',
        date: '2026-11-16',
        scoring: 'Paper + Electronic Mix',
      },
    ],
  },
  {
    id: 2,
    name: 'State Open Shooting Meet',
    from_date: '2026-12-02',
    to_date: '2026-12-05',
    level: 'State',
    venue: 'Balewadi Sports Complex, Pune',
    description:
      'Open state competition for junior and senior athletes across multiple pistol and rifle events.',
    events: [
      {
        id: 201,
        name: '10m Air Rifle Mixed',
        date: '2026-12-02',
        scoring: 'Manual Scoring',
      },
      {
        id: 202,
        name: '25m Rapid Fire Pistol',
        date: '2026-12-03',
        scoring: 'Electronic Scoring',
      },
      {
        id: 203,
        name: '10m Air Pistol Junior',
        date: '2026-12-04',
        scoring: 'ISSF Electronic Scoring',
      },
      {
        id: 204,
        name: 'Team Relay Finals',
        date: '2026-12-05',
        scoring: 'Live Scoring Board',
      },
    ],
  },
  {
    id: 3,
    name: 'GFG Inter-Academy Challenge',
    from_date: '2026-10-20',
    to_date: '2026-10-22',
    level: 'Academy',
    venue: 'Gun For Glory Academy, Pune',
    description:
      'Friendly inter-academy challenge focused on form, consistency and match temperament.',
    events: [
      {
        id: 301,
        name: 'Foundation Course Match',
        date: '2026-10-20',
        scoring: 'Coach Verified',
      },
      {
        id: 302,
        name: 'Bull’s Eye Challenge',
        date: '2026-10-21',
        scoring: 'Manual Scoring',
      },
      {
        id: 303,
        name: 'Precision Relay',
        date: '2026-10-22',
        scoring: 'Live Lane Scoring',
      },
    ],
  },
  {
    id: 4,
    name: 'Asian Youth Shooting Cup',
    from_date: '2027-01-08',
    to_date: '2027-01-14',
    level: 'International',
    venue: 'Jakarta International Shooting Range',
    description:
      'International youth cup with qualification and finals across ISSF-recognized events.',
    events: [
      {
        id: 401,
        name: '10m Air Rifle Youth',
        date: '2027-01-09',
        scoring: 'ISSF Electronic Scoring',
      },
      {
        id: 402,
        name: '10m Air Pistol Youth',
        date: '2027-01-11',
        scoring: 'ISSF Electronic Scoring',
      },
      {
        id: 403,
        name: 'Mixed Team Final',
        date: '2027-01-13',
        scoring: 'ISSF Finals Format',
      },
    ],
  },
  {
    id: 5,
    name: 'District Selection Trials',
    from_date: '2026-11-01',
    to_date: '2026-11-02',
    level: 'District',
    venue: 'Sangli District Shooting Range',
    description:
      'Selection trials for district representation in upcoming state championships.',
    events: [
      {
        id: 501,
        name: 'Selection Round - Rifle',
        date: '2026-11-01',
        scoring: 'Manual Scoring',
      },
      {
        id: 502,
        name: 'Selection Round - Pistol',
        date: '2026-11-02',
        scoring: 'Manual Scoring',
      },
    ],
  },
];

function getCompetitionById(id) {
  return competitions.find((item) => String(item.id) === String(id)) || null;
}

function getLevelColor(level) {
  switch (String(level || '').toLowerCase()) {
    case 'international':
      return '#5B8CFF';
    case 'national':
      return '#EB6925';
    case 'state':
      return '#2BA750';
    case 'district':
      return '#E0B519';
    case 'academy':
      return '#9B59B6';
    default:
      return '#A8A8A8';
  }
}

export { competitions, getCompetitionById, getLevelColor };
