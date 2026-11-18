# Golf clubs research (CDMX, Estado de México, Querétaro)

Verified on 2026-11-17. Data file: `src/data/clubs.json`. 22 clubs; 2 have a price; 7 are listed as accepting non-members. Every value comes from the cited page; anything not stated is null. Most sources are third-party listings (GolfPass, programadestinosmexico.com), not club sites, so confidence is mostly media or baja.

| Name | City | Accepts non-members | From price | Source |
|---|---|---|---|---|
| Club de Golf México | CDMX | unknown | n/a | https://www.golfpass.com/travel-advisor/courses/22363-club-de-golf-mexico |
| Club Campestre de la Ciudad de México | CDMX | unknown | n/a | https://www.golfpass.com/travel-advisor/courses/22360-club-campestre-de-la-ciudad-de-mexico/ |
| Club de Golf Chapultepec | Estado de México | no | n/a | https://www.golfpass.com/travel-advisor/courses/22362-club-de-golf-chapultepec |
| Club de Golf Bosques | CDMX | no | n/a | https://www.golfpass.com/travel-advisor/courses/22361-club-de-golf-bosques |
| Club de Golf Bosques de Santa Fe | CDMX | unknown | n/a | https://www.hole19golf.com/mexico/club-de-golf-bosques-de-santa-fe |
| Campo de Golf Las Dalias (Cuemanco) | CDMX | yes | n/a | https://www.golfpass.com/travel-advisor/courses/37714-campo-de-golf-las-dalias-cuemanco |
| Parres Golf Course | CDMX | yes | n/a | https://www.golfpass.com/travel-advisor/courses/36329-parres-golf-course |
| Metrópoli Golf Center | CDMX | yes | 190 MXN | https://metropoligolfcenter.com |
| Bosque Real Country Club | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Club Campestre Chiluca | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Club de Golf Bellavista | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Club de Golf Vallescondido | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Club de Golf La Hacienda | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Madeiras Country Club | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Lomas Country Club | Estado de México | yes | n/a | https://www.golfpass.com/travel-advisor/courses/22624-lomas-country-club |
| La Esmeralda Country Club | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Coral Golf Club | Estado de México | unknown | n/a | https://programadestinosmexico.com/golf/ciudad-de-mexico.html |
| Club Campestre El Copal | Estado de México | yes | n/a | https://www.golfpass.com/travel-advisor/courses/22629-club-campestre-el-copal |
| Zibatá Golf Club | Querétaro | yes | 1500 MXN | https://zibatagolf.com |
| Golf Juriquilla | Querétaro | unknown | n/a | https://golfjuriquilla.com |
| Club Campestre de Querétaro | Querétaro | no | n/a | https://www.golfpass.com/travel-advisor/courses/22408-club-campestre-de-queretaro |
| Club de Golf San Gil | Querétaro | yes | n/a | https://www.golfpass.com/travel-advisor/courses/22411-club-de-golf-san-gil |

"Accepts non-members: unknown" means sources conflict or do not say. Per-club conflicts are in `priceNote`. "From price" for Metrópoli is a driving range session, not a round.

## Unverified or dropped

- Balvanera Polo & Country Club (Querétaro): only seen in search results, never opened; listings say private. Dropped.
- Club de Golf Cuernavaca, Los Encinos (Lerma), Rancho Viejo, Las Lomas Club de Golf, San Carlos (Metepec), Club de Golf Santa Fe, El Campanario: appeared only in search snippets; not opened. Dropped.
- Club de Golf Juriquilla vs Club de Golf Provincia Juriquilla: possible name overlap, not resolved.
- 1golf.eu returned HTTP 403, so its prices (for example Campestre CDMX 1,497 to 2,339 MXN, Chiluca 1,800 weekday) were seen only in search snippets and are not recorded.
- San Juan del Río green fee (1,400 to 1,500 weekday, 1,800 to 1,900 weekend) comes from a generic page that does not name the club, so it is not attached to San Gil.
- Golf Parres and Cuemanco public status comes from GolfPass; their own sites were not found.
- No public driving range other than Metrópoli Golf Center was confirmed with a source.

## How to refresh

Prices, hours, phones and access policies change often. Before launch, recheck every price and access policy directly with each club (call or WhatsApp) or its official site, and update `verifiedOn`. Most entries have no price at all and need a quote.
