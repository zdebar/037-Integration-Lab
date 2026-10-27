# CLEAN CODE GUIDE

## Rychlá orientace

|   # | Oblast                                | Témata                                         |
| --: | ------------------------------------- | ---------------------------------------------- |
|   1 | Než začneš psát kód                   | Cíl, omezení, scénáře, kritéria hotovo         |
|   2 | Rozhraní a hranice systému            | Moduly, odpovědnosti, závislosti, architektura |
|   3 | Data a stav                           | Vlastnictví, datový tok, databázové invarianty |
|   4 | API a aplikační logika                | Validace, kontrakty, čistá logika, efekty      |
|   5 | Spolehlivost při chybách              | Timeouty, retry, idempotence, zdroje           |
|   6 | Souběh a konzistence                  | Transakce, atomické změny, fronty              |
|   7 | Bezpečnost                            | Autentizace, oprávnění, tajné údaje, vstupy    |
|   8 | Testování                             | Jednotkové, integrační a end-to-end testy      |
|   9 | Provoz a pozorovatelnost              | Logy, metriky, trasování, konfigurace          |
|  10 | Refaktor a změny existujícího systému | Malé kroky, migrace, návratové cesty           |
|  11 | Volba architektury                    | Vrstvy, modulární monolit, události, služby    |
|  12 | Pracovní checklisty                   | Před PR, před nasazením, při incidentu         |

## 1. Než začneš psát code

1. Ujasni si výsledek
   - Napiš jednu větu: kdo něco potřebuje udělat, v jaké situaci a jak poznáme, že se to povedlo
   - Omezení: oprávnění, rychlost, dostupnost, objem dat, kompatibilita a dopad na existující uživatele

2. Sepiš scénáře a hranice
   | Scénář | Příklad |
   |---|---|
   | Běžná cesta | Platný požadavek a očekávaný výsledek |
   | Hraniční vstupy | Chybějící, prázdná, příliš dlouhá nebo chybná data |
   | Oprávnění | Anonymní uživatel, vlastník dat, jiný uživatel, správce |
   | Selhání | Databáze nedostupná, klient se odpojí, externí služba odpoví pozdě |
   | Souběh | Dva požadavky mění stejný záznam téměř současně |

3. Definuj minimální hotovou změnu
   - vykreslení obrazovky, chování, bezpečnost, provozní dopady

## 2. Rozhraní a hranice systému

1. Odpovědnost, soudržnosti a závislosti
   | Pojem | Význam |
   |---|---|
   | Soudržnost | Části modulu slouží jednomu účelu. |
   | Provázanost | Jiné moduly znají co nejméně jeho vnitřního uspořádání. |

2. Navrhni malé veřejné rozhraní
   - má říci jaká data přijímá, co vrací, jaký chyby může vyvolat a jaké vedlejší účinky provede
   - interface, docstrings, documentations, tests

3. Kde zavést abstrakci
   - na významnou hranice - databáze, siť, čas, souborový systém, platební poskytovatel

4. SOLID jako kontrolní otázky
   | Princip | Kontrolní otázka |
   |---|---|
   | S — jedna odpovědnost | Má tento modul jeden soudržný důvod ke změně? |
   | O — rozšiřitelnost | Existuje opakovaná variace, kterou stojí za to podpořit? |
   | L — zastupitelnost | Dodržuje tato implementace slibované chování? |
   | I — malé rozhraní | Dostává volající jen schopnosti, které potřebuje? |
   | D — obrácení závislostí | Závisí pravidla na infrastruktuře, nebo infrastruktura na pravidlech? |

## 3. Data a stav

1. Urči, kde stav žije
   - každý fakt má mít jednoho autoritativnho vlastníka a jasnou dobu života

2. Zviditelni tok data
   - loading, prázdný výsledek, chyba
   - neskladuj zároveň zdrojová data i jejich dopočitátelné souhrny
   - subscription, listener, stream uvolní
   - cache - vždy jasné kdy a čím se zneplatní

3. Databáze chráni trvalé invarianty
   - validade na klientu zlepšuje použitelnost
   - na backendu bezpečnost
   - databáze před všemi cestami zápisu, včetně skriptů, budoucích API, souběžných požadavků
   - normalizuje autoritativní data - ukládej primárně na jednom místě
   - denormalizuj - pro rychlost

## 4. API a aplikační logika

- API je smlouva mezi klientem a serverem. Popisuje platný vstup, výsledek, chyby, oprávnění, vedlejší účinky.
- Praktické pravidlo - Route handler drž tenký. Aplikační služba řídí use case. Repository skrývá SQL. Neobaluj každou funkci do vrstvy, pokud to nic neusnadní.

1. Zpracuj požadavek na hranici
   - udržuj kontrakt verzovaný a dokumentovaný - OpenAPI
   - HTTP Request
     1. ověř identitu
     2. ověř tvar, velikost, formát vstupu
     3. ověř oprávnění k danému objektu a operaci
     4. spusť aplikační pravidlo
     5. ulož atomickou změnu
     6. vrať stabilní výsledek

2. Odděl čisté výpočty od efektů
   - čas, náhodnost, externí služby předávej tam, kde ovlivňují chování
   - Dependency Injection - začni prostě, kontejner a rozhraní zaváděj jen tehdy, když zjednodušují konkrétní testování nebo výměnu adaptéru

## 5. Spolehlivost při chybách

- Systém musí správně reagovat i tehdy, když se část operace povedla a odpověď se ztratila. Chyba komunikace často znamená "výsledek neznámý", ne "operace neproběhla".

| Typ výsledku        | Jak s ním naložit                                                   |
| ------------------- | ------------------------------------------------------------------- |
| Očekávané zamítnutí | Vrátit explicitní výsledek; nejde o serverovou havárii.             |
| Neočekávané selhání | Zaznamenat bezpečný kontext a vrátit vhodnou chybu.                 |
| Neznámý výsledek    | Zjistit stav nebo požadavek zopakovat se stabilním idempotency key. |

| Pravidlo                             | Význam                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Timeout                              | Omezuje dobu čekání, ale nezaručuje zrušení vzdálené operace.                                             |
| Retry                                | Používej jen pro dočasné chyby, s konečným počtem pokusů, celkovým časovým limitem a náhodným rozestupem. |
| Stabilní klíč při opakování          | Opakovaný požadavek musí vrátit stejný logický výsledek, ne provést akci znovu.                           |
| Stejný idempotency key, jiný payload | Požadavek odmítni.                                                                                        |
| Jedna vrstva řídí retry              | Urči jednu vrstvu, která rozhoduje, kdy a jak požadavek opakovat.                                         |

OMEZ SPOTŘEBU ZDROJŮ

Při problému nejdřív změř, kde systém čeká nebo spotřebovává kapacitu. Potom uprav limit nebo algoritmus.
Náhodné zvyšování poolu může přetížit databázi.

| Oblast   | Co omezit nebo nastavit                                        |
| -------- | -------------------------------------------------------------- |
| HTTP     | Maximální velikost těla požadavku, délku požadavku, rate limit |
| Databáze | Pool spojení rozpočítaný přes všechny instance, timeout dotazu |
| Fronta   | Kapacitu, souběh workerů, maximální počet retry a stáří úlohy  |
| Odpovědi | Stránkování a maximální počet vrácených záznamů                |

## 6. Souběh a konzistence

Asynchronní zpracování efektivně překrývá čekání na I/O. Nechrání ale samo o sobě sdílená pravidla. Dva
požadavky mohou současně přečíst stejnou hodnotu a oba se rozhodnout podle zastaralého stavu.

1. Nedělej nechráněnné read-then-write
   - použij SQL transakci - lokální zámek v Node.js nechrání jiný proces ani druhou instanci aplikace.

2. Vyber nástroj podle invarianty
   | Situace | Vhodný nástroj |
   |---|---|
   | Jedna podmíněná změna řádku | Atomický `UPDATE` s podmínkou a kontrolou počtu změněných řádků |
   | Více databázových změn musí uspět spolu | Databázová transakce |
   | Ochrana před zastaralou editací | Optimistická verze / compare-and-swap |
   | Vzácný konflikt vyžaduje serializaci | Zámek nebo silnější izolační úroveň; navrhni retry transakce |
   | Dlouhá práce mimo request | Durable queue a idempotentní worker |

3. Asynchronní práce a fronty
   - Do fronty posílej identifikátor a potřebná neměnná fakta, ne obrovské objekty.
   - Worker musí počítat s duplicitním doručením a částečným dokončením.
   - Ulož stav úlohy: queued, running, succeeded, failed; uveď opakování a poslední chybu.
   - Při publikaci události po databázovém zápisu zvaž transactional outbox, aby se změna a úloha neztratily odděleně

## 7. Bezpečnost

Bezpečnost začíná na hranici důvěry. Klient může poslat libovolná data a tvrdit libovolné ID. Ověřování tvaru
vstupu, identity a oprávnění jsou různé kroky

1. Trojí kontrola

| Kontrola    | Co ověřuje              | Příklad                                                 |
| ----------- | ----------------------- | ------------------------------------------------------- |
| Validace    | Správnost vstupu        | Jsou povinná pole vyplněná a ve správném formátu?       |
| Autentizace | Kdo uživatel je         | Session nebo ověřený token                              |
| Autorizace  | Co smí uživatel provést | Smí tato identita provést tuto akci nad tímto objektem? |

2. Pravidla pro praktický backend

| Pravidlo                          | Co znamená                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Ověř oprávnění                    | Kontroluj je pro každý objekt a každou operaci.                                                        |
| Tenant nebo user ID               | Ber ho z ověřené identity, ne z těla požadavku.                                                        |
| SQL parametrizace                 | Uživatelské řetězce nikdy nevkládej do SQL jako kód.                                                   |
| Tajné klíče                       | Ukládej je v secret manageru nebo runtime konfiguraci; nepatří do repozitáře, browser bundle ani logu. |
| Omez privilegia databázového účtu | Odděl veřejné a serverové klíče a přiděl jen potřebná oprávnění.                                       |
| Limity požadavků                  | Ověř velikost payloadu, nastav limity uploadu a rate limit.                                            |

Pravidlo nejmenších oprávnění - Každá část systému má mít pouze přístup potřebný pro svou práci. Oprávnění kontroluj na serveru i na databázové hranici, pokud ji může obejít jiná cesta zápisu.

## 8. Testování

Test je užitečný, když by selhal při porušení konkrétního pravidla. Začni nejlevnějším testem, který dané riziko
opravdu zachytí

| Typ        | Co ověřuje                                  | Příklad                                              |
| ---------- | ------------------------------------------- | ---------------------------------------------------- |
| Jednotkový | Čistá pravidla a hraniční hodnoty           | Výpočet skóre, přechod stavu, validace.              |
| Integrační | Skutečné adaptéry a databázová pravidla     | SQL constraint, transakce, RLS, repository.          |
| End-to-end | Důležitý uživatelský průchod celým systémem | Přihlášení → odeslání odpovědi → zobrazení výsledku. |
| Zátěžový   | Kapacita a chování při souběhu              | Dvě souběžné rezervace posledního kusu.              |

1. Testuj pozorovatelné chování

   • Ověř výsledek a změnu dat, ne přesné pořadí interních volání.
   • Falešný repository neprokáže, že SQL constraint nebo transakce funguje.
   • Externí služby nahrazuj controllovaným adaptérem; reálný adapter otestuj zvlášť.
   • U kritických operací testuj opakování, timeout, pozdní odpověď a zotavení po pádu.
   • End-to-end testů drž málo a zaměř je na klíčové cesty.

2. Testovací matice pro API změnu

| Případ                  | Očekávané chování                                 |
| ----------------------- | ------------------------------------------------- |
| Platný vstup + vlastník | Úspěch a přesně jedna trvalá změna                |
| Neplatný vstup          | 4xx; databáze se nezměnila                        |
| Bez identity            | 401; citlivý detail se nevrací                    |
| Cizí objekt             | 403 nebo konzistentní 404 dle politiky            |
| Duplicitní požadavek    | Stejný logický výsledek, žádná duplicita          |
| DB chyba                | Bez falešného úspěchu; bezpečný log a vhodný stav |
| Souběh                  | Invariant zůstane zachován                        |

## 9. Provoz a pozovatelnost

| Signál             | Příklady                                                                      |
| ------------------ | ----------------------------------------------------------------------------- |
| Strukturované logy | `requestId`, bezpečný identifikátor uživatele/tenanta, typ události, výsledek |
| Metriky            | Počet chyb, p95 latence, stáří fronty, čekání na DB pool                      |
| Trace              | `request → API → DB → externí služba`                                         |

1. Co zaznamenat
   - ID požadavku nebo trace ID, typ operace a bezpečný kontext.
   - Chybový typ, délku zpracování, počet retry a výsledek.
   - Počet a stáří úloh ve frontě; zdravý HTTP server může mít zablokované pracovní úlohy.
   - Upozornění jen na dopad, který vyžaduje akci, a připoj návod k obnově.

2. Chraň data v telemetrii
   - Neloguji hesla, tokeny, celé platební payloady ani zbytečné osobní údaje.
   - Metrické štítky mají omezený počet hodnot; nepoužívej jako label user ID nebo order ID.
   - Nastav retenci, přístupová práva a sampling podle účelu a objemu.

3. Konfigurace a nasazení
   - Načti konfiguraci při startu, zvaliduj ji a při chybě skonči s jasnou zprávou.
   - Odděl secrets od běžné konfigurace a vývojové hodnoty od produkčních.
   - DB migrace navrhuj pro kompatibilní postup: přidej → naplň → přepni čtení/zápis → odstraň staré.
   - Změnu nejprve nasaď tak, aby stará i nová verze mohly krátce bezpečně běžet vedle sebe.

## 10. Refactor a změny existujícího systému

1. Bezpečný postup po malých krocích
   | Krok | Činnost |
   |---|---|
   | 1. Zachyť chování | Doplň charakterizační test nebo příklady vstup → výstup. |
   | 2. Vytvoř hranici | Zaveď malé rozhraní nebo funkci kolem měněné odpovědnosti. |
   | 3. Přesuň jednu věc | Odděl pravidlo, persistence nebo volání služby bez současné změny obchodní logiky. |
   | 4. Ověř ekvivalenci | Spusť cílené testy, porovnej výsledek a případně loguj rozdíly. |
   | 5. Odstraň přechodový kód | Smaž starou cestu a dočasné příznaky, jakmile je migrace ověřená. |

## 11. Volba architektury

Vyber nejmenší strukturu, která chrání důležité hranice. Rozdělení do procesů přináší síťové chyby, více nasazení,
monitoring, autentizaci mezi službami a náročnější obnovu.

- Monolit -- základní
- Microservices -- když nějaká část potřebuje samostatně škálovat / nasazovat nebo má jiného vlastníka
