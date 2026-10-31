export interface MapLocation {
  id: string
  name: string
  description: string
  /** [latitude, longitude] in WGS84 */
  position: [number, number]
}

/**
 * Placeholder dataset — replace with whatever you decide to visualise.
 * A few well-known Dutch landmarks for now.
 */
export const locations: MapLocation[] = [
  {
    id: 'dam',
    name: 'De Dam, Amsterdam',
    description: 'Centraal plein van Amsterdam.',
    position: [52.3731, 4.8926],
  },
  {
    id: 'domtoren',
    name: 'Domtoren, Utrecht',
    description: 'Hoogste kerktoren van Nederland.',
    position: [52.0907, 5.1214],
  },
  {
    id: 'euromast',
    name: 'Euromast, Rotterdam',
    description: 'Uitkijktoren in Rotterdam.',
    position: [51.9054, 4.4663],
  },
  {
    id: 'binnenhof',
    name: 'Binnenhof, Den Haag',
    description: 'Centrum van de Nederlandse politiek.',
    position: [52.0797, 4.3134],
  },
  {
    id: 'afsluitdijk',
    name: 'Afsluitdijk (monument)',
    description: 'Iconische waterbouwkundige dijk.',
    position: [53.0068, 5.0342],
  },
]
