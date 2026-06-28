# Actualizare documentație existentă

Când este invocat acest command, urmează pașii de mai jos.

## Comportament

1. Cere utilizatorului ce doc vrea să actualizeze (feature, layout, page) și ce s-a schimbat
2. Citește fișierul existent din `docs/`
3. Actualizează **doar secțiunile relevante** — nu rescrie tot dacă nu e necesar
4. Bifează TODOs completate dacă utilizatorul confirmă că au fost implementate
5. Adaugă TODOs noi dacă au apărut cerințe noi
6. Actualizează **Probleme actuale** dacă bug-uri au fost rezolvate sau au apărut altele noi

## Ce să actualizezi întotdeauna

- **Status actual / Probleme actuale** — cel mai des se schimbă
- **TODOs** — bifează ce s-a terminat `[x]`, adaugă ce a apărut nou
- **Tech Specs** — dacă s-au schimbat componente, rute, sau surse de date
- **PRD** — doar dacă cerințele s-au schimbat fundamental
- **Schema DB** — dacă s-au adăugat/modificat/șters coloane, tabele, relații sau indexuri; actualizează SQL-ul să reflecte starea curentă reală
- **TODOs Backend → DB / Migrări** — bifează migrările aplicate, adaugă coloane/tabele noi apărute

## Ce să NU schimbi fără motiv

- Structura secțiunilor — PRD / Tech Specs / TODOs FE / TODOs BE rămân în această ordine
- Informații corecte și actuale — nu șterge context valoros
- TODOs deja bifate — lasă-le ca istoric

## Reguli

- Nu rescrie un doc complet dacă doar câteva lucruri s-au schimbat
- Dacă un feature a crescut mult în complexitate → creează un doc nou cu `/creareDocsFeature` și arhivează-l pe cel vechi
- Păstrează același ton și nivel de detaliu ca documentul original
- **Schema DB** — SQL-ul din doc trebuie să reflecte mereu starea curentă a DB, nu ce a fost planificat inițial; dacă o coloană a fost redenumită sau un tabel restructurat, actualizează SQL-ul complet
- Dacă doc-ul nu are secțiunea `Schema DB` dar feature-ul folosește acum DB → adaug-o în Tech Specs înainte de „Probleme actuale", urmând structura din `creareDocsFeature.md`
- Proiectul folosește **Neon (PostgreSQL)** — SQL standard, fără Prisma schema sau ORM specific
