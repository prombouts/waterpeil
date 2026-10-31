export type Language = 'nl' | 'en'

interface AppTranslations {
  title: string
  subtitle: string
  languageSwitcher: string
  dutchLanguage: string
  englishLanguage: string
  floodSimulation: string
  waterLevel: string
  loadingElevation: string
  elevationError: string
  zoomInHint: string
  floodHint: string
  mapAttribution: string
  elevationAttribution: string
  standardMap: string
  aerialPhoto: string
  elevationOverlay: string
  queryingElevation: string
  elevationQueryError: string
  elevationTitle: string
  noData: string
  groundSurface: string
  surface: string
  version: string
  locationDescriptions: Record<string, string>
}

export const translations: Record<Language, AppTranslations> = {
  nl: {
    title: 'Doorbraakkaart',
    subtitle:
      'Hoogtekaart van Nederland — klik op de kaart om de hoogte te zien, of simuleer een dijkdoorbraak',
    languageSwitcher: 'Taal kiezen',
    dutchLanguage: 'Nederlands',
    englishLanguage: 'Engels',
    floodSimulation: 'Dijkdoorbraak-simulatie',
    waterLevel: 'Waterpeil:',
    loadingElevation: 'Hoogtedata laden…',
    elevationError: 'Laden van hoogtedata mislukt.',
    zoomInHint: 'Zoom verder in om de simulatie te zien.',
    floodHint:
      'Blauw = land onder het gekozen waterpeil (vereenvoudigd “badkuip”-model op basis van AHN-maaiveldhoogte).',
    mapAttribution: 'Kaartgegevens',
    elevationAttribution: 'Hoogte',
    standardMap: 'Standaardkaart',
    aerialPhoto: 'Luchtfoto',
    elevationOverlay: 'Hoogte — oppervlak (AHN DSM)',
    queryingElevation: 'Hoogte opvragen…',
    elevationQueryError: 'Hoogte opvragen mislukt.',
    elevationTitle: 'Hoogte (AHN)',
    noData: 'geen data',
    groundSurface: 'Maaiveld (DTM)',
    surface: 'Oppervlak (DSM)',
    version: 'Versie',
    locationDescriptions: {
      dam: 'Centraal plein van Amsterdam.',
      domtoren: 'Hoogste kerktoren van Nederland.',
      euromast: 'Uitkijktoren in Rotterdam.',
      binnenhof: 'Centrum van de Nederlandse politiek.',
      afsluitdijk: 'Iconische waterbouwkundige dijk.',
    },
  },
  en: {
    title: 'Flood map',
    subtitle:
      'Elevation map of the Netherlands — click the map to check elevation or simulate a dike breach',
    languageSwitcher: 'Choose language',
    dutchLanguage: 'Dutch',
    englishLanguage: 'English',
    floodSimulation: 'Dike breach simulation',
    waterLevel: 'Water level:',
    loadingElevation: 'Loading elevation data…',
    elevationError: 'Failed to load elevation data.',
    zoomInHint: 'Zoom in further to see the simulation.',
    floodHint:
      'Blue = land below the selected water level (simplified “bathtub” model based on AHN ground elevation).',
    mapAttribution: 'Map data',
    elevationAttribution: 'Elevation',
    standardMap: 'Standard map',
    aerialPhoto: 'Aerial photo',
    elevationOverlay: 'Elevation — surface (AHN DSM)',
    queryingElevation: 'Loading elevation…',
    elevationQueryError: 'Failed to load elevation.',
    elevationTitle: 'Elevation (AHN)',
    noData: 'no data',
    groundSurface: 'Ground (DTM)',
    surface: 'Surface (DSM)',
    version: 'Version',
    locationDescriptions: {
      dam: 'Central square of Amsterdam.',
      domtoren: 'The tallest church tower in the Netherlands.',
      euromast: 'Observation tower in Rotterdam.',
      binnenhof: 'Historic centre of Dutch politics.',
      afsluitdijk: 'Iconic Dutch water-management dike.',
    },
  },
}
