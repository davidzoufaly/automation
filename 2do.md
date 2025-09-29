## Cíl

1. Refaktorovat stávající řešení, aby šlo jednoduše konfigurovat na jednom místě.
2. Nebylo závislé na konkrétním JIRA projektu, JIRA workflow, QA testers, Developers
3. Lze nakonfigurovat přesnou podobu zpráv.
4. Je možné řešení testovat z lokálního prostředí bez nutnosti využování aplikací 3. stran - JIRA, GIT, Slack.
5. V případě testování slackových akcí, je možné řešení testovat tak, aby nedošlo k taggovaní reálných
   uživatelů.
6. Orchestrace v byznys logice probíhá na úrovní JS/TS github workflows jsou použité v nejtenší možné míře.
7. Codeowners jsou hlavním zdrojem dat pro určení vývojářů, ale mohou být přepsáni v configu kvůli testování

## Jak na to

ad1,2,3,7 = Config file ad4 = abstrakční vrstva, která na devu simuluje akce a vypisuje v consoli a na
produkci volá reálná API ad5 = fake names strings v configu ad6) Rozjet TS + Building

- udělat monorepo / vedlejší projekt, který bude tenhle package používat

## 2DO

- [x] rozjet TS
- [x] rozjet prettier
- [x] rozjet build
- [x] Vytvořit template config
- [x] Zjistit transition ID's
- [] Vytvořit default config
- [] Vytvořit user config po vzoru MC monorepa
- [] Default config lze rozšířit user configem
- [] Cesta k user configu je nastavitelná


new     -(61)-> hacking -(251)-> code review -(81)-> verification
backlog -(61)->

new     <-(241 - not needed)- hacking <-(151)- code review <-(not needed)- verification
backlog <-(201 - not needed)-
