# Doorbraakkaart

**[doorbraakkaart.nl](https://doorbraakkaart.nl)** — React web app die Nederland visualiseert op de [PDOK](https://www.pdok.nl) **BRT Achtergrondkaart** (Kadaster), met AHN-hoogte-informatie en een dijkdoorbraak-simulatie: kies een waterpeil en zie welk land onder water komt te staan. Wat er verder op de kaart komt is nog te bepalen — er staan nu voorbeeldmarkers (landmarks) in `src/data/locations.ts`.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Leaflet](https://leafletjs.com) / [react-leaflet](https://react-leaflet.js.org)
- PDOK WMTS-tiles (gratis, geen API-key): `https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png`

## Functies

- **Hoogte-informatie (AHN)**: hoogte-overlay oppervlak (`dsm_05m`, 0,5 m resolutie) standaard ingeschakeld; schakelbaar via het lagenmenu (rechtsboven). Klik op de kaart om de exacte hoogte (m t.o.v. NAP) op dat punt op te vragen (WMS GetFeatureInfo, zowel maaiveld als oppervlak).
- **Dijkdoorbraak-simulatie**: kies een waterpeil (in stappen van 0,5 m, −2 t/m +10 m NAP) en zie welk land onder water komt te staan. De app haalt ruwe AHN-maaiveldhoogtes voor het zichtbare kaartbeeld op via de PDOK **WCS** (GeoTIFF, gedecodeerd met geotiff.js) en kleurt alle pixels onder het gekozen peil blauw — donkerder naarmate het water dieper staat. Let op: dit is een vereenvoudigd &ldquo;badkuip&rdquo;-model (geen rekening met waterstromen, dijkringen of gemalen). Zoom minimaal tot niveau 10 in.
- Startweergave: Haarsteeg, met Waalwijk en 's-Hertogenbosch in beeld.
- Voorbeeldmarkers in `src/data/locations.ts`.

## Ontwikkelen

```sh
npm install
npm run dev      # dev-server op http://localhost:5173
npm run build    # productie-build naar dist/
npm run preview  # lokaal de build bekijken
```

## Eigen data tonen

Pas `src/data/locations.ts` aan (of vervang door een fetch naar een API/GeoJSON) — elk item heeft `name`, `description` en `position` (`[lat, lng]`). De markers worden gerenderd in `src/components/PdokMap.tsx`.

## Deployen naar Azure Static Web Apps

Maak de resource group en de Free-tier Static Web App aan vanuit de repository-root:

```powershell
az deployment sub create --location westeurope --template-file infra/main.bicep --parameters resourceGroupName=rg-doorbraakkaart-prod staticWebAppName=doorbraakkaart-prombouts
```

Bouw en publiceer daarna de statische bestanden met de deployment token van de app:

```powershell
npm ci
npm run build
$token = az staticwebapp secrets list --name doorbraakkaart-prombouts --resource-group rg-doorbraakkaart-prod --query properties.apiKey --output tsv
npx --yes @azure/static-web-apps-cli deploy ./dist --deployment-token $token --env production
Remove-Variable token
```

Release Please beheert de SemVer-versies vanuit Conventional Commits: `fix:` verhoogt de patch, `feat:` de minor en een breaking change (bijvoorbeeld `feat!:`) de major. De footer toont de versie uit `package.json`. Release Please maakt of actualiseert een release-PR na commits op `main`; na het mergen maakt het een GitHub Release. Alleen wanneer een nieuwe release is aangemaakt, bouwt en publiceert `.github/workflows/azure-static-web-apps.yml` de app naar Azure. Een gewone push of het bijwerken van een release-PR deployt dus niet. Hiervoor moet de GitHub repository-secret `AZURE_STATIC_WEB_APPS_API_TOKEN` de deployment token van de Static Web App bevatten. `public/staticwebapp.config.json` bevat de SPA-fallback-configuratie. Koppel eventueel het custom domain **doorbraakkaart.nl** in Azure Portal → Static Web App → *Custom domains* → *Add*, en stel bij de registrar de gevraagde DNS-records in (CNAME voor `www`, TXT + ALIAS/A voor de apex).


## Auteur

[Peter Rombouts](https://www.peterrombouts.nl/)

## Andere PDOK-lagen

De luchtfoto is beschikbaar als basislaag via het lagenmenu op de kaart. Andere PDOK-lagen (zoals BGT en grijs/pastel varianten) kun je toevoegen door de tile-URL in `PdokMap.tsx` te vervangen, bijv.:

- Grijs: `.../wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png`
- Pastel: `.../wmts/v2_0/pastel/EPSG:3857/{z}/{x}/{y}.png`
