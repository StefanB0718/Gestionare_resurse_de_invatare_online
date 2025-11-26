1\. Descriere generala



Aplicatia „Online Learning Resources Manager” este o aplicație web tip SPA (Single Page Application) care ajuta utilizatorii sa isi organizeze resursele de invatare online, cum ar fi articole, videoclipuri, linkuri si diverse materiale educationale. Ideea aplicatiei este sa ofere un loc central unde utilizatorul isi poate adauga resursele, le poate grupa pe cursuri si poate chiar sa distribuie anumite resurse direct pe Facebook, pe grupuri sau pagini.



Aplicatia are doua parti principale:



un back-end RESTful facut cu Node.js, care tine datele si le expune prin endpoint-uri;



un front-end React, care este o aplicație SPA si consuma API-ul facut in back-end.



Proiectul foloseste autentificare cu JWT, astfel incat utilizatorii trebuie sa fie logati ca sa isi vada sau editeze resursele. Datele ramân protejate si accesul este permis doar pentru resursele proprii.



Aplicatia are si integrare externa cu Facebook Graph API, pentru a permite utilizatorilor sa distribuie resursele direct pe Facebook.



2\. Obiective si cerinte functionale



Obiectivul principal este realizarea unei aplicatii simple, dar functionale, care sa permita gestionarea resurselor de invatare. Cerintele sunt:



* Inregistrarea si autentificarea utilizatorilor.
* Crearea si administrarea cursurilor sau colectiilor unde sunt grupate resursele.
* Adaugarea si gestionarea resurselor din fiecare curs.
* Restrictionarea accesului: fiecare utilizator vede doar datele lui.
* Optiune pentru a distribui o resursa pe Facebook printr-un buton dedicat.
* Un front-end React cu componente si routing, care consuma API-ul din back-end.

Functionalitati detaliate:

* Utilizatorul se poate inregistra cu nume, email si parola.
* Utilizatorul se poate loga si primeste un token JWT.
* Utilizatorul logat poate:
* crea cursuri noi,
* edita sau sterge cursurile existente,
* adauga resurse noi in cursuri,
* modifica sau sterge resursele existente,
* distribui resurse pe Facebook.
* Aplicatia valideaza mereu ca resursa sau cursul apartine utilizatorului logat.



3\. Model de date si relatii



Aplicatia foloseste cel putin doua entitati cu relatii parinte–copil. Modelul de date este simplu, astfel incat sa fie usor de implementat cu un ORM.



Entitatea User



* id
* name
* email
* passwordHash
* createdAt

Relatie: 1 utilizator are mai multe cursuri.



Entitatea Course (copil al User)

* id
* userId
* title
* description
* createdAt

Relatie: un curs are mai multe resurse.



Entitatea Resource (copil al Course)

* id
* courseId
* title
* url
* type (video, article, link etc.)
* description
* createdAt



Entitatea ShareEvent (opțional, pentru log Facebook)

* id
* resourceId
* userId
* status (SUCCESS / FAILED)
* createdAt



4\. Arhitectura aplicatiei

Aplicatia este structurata pe model client–server.



Back-end (Node.js + Express)

* expune endpoint-uri REST (CRUD)
* foloseste un ORM (ex. Prisma, Sequelize sau TypeORM)
* salveaza datele in PostgreSQL
* autentificare JWT
* endpoint separat pentru integrarea cu Facebook



Front-end (React)

* SPA realizata cu React + React Router
* componente separate pentru login, dashboard, cursuri, resurse
* apeluri catre API prin fetch/axios
* stocarea token-ului JWT in localStorage pentru a pastra sesiunea dupa refresh



Integrare Facebook

* foloseste Facebook Graph API pentru a posta link-uri pe pagini/grupuri
* back-end-ul se ocupa de apelul catre Facebook
* rezultatul share-ului este salvat in ShareEvent



5\. Endpoint-uri REST



Autentificare

* POST /api/auth/register
* POST /api/auth/login



Cursuri (CRUD)

* GET /api/courses
* POST /api/courses
* GET /api/courses/:id
* PUT /api/courses/:id
* DELETE /api/courses/:id



Resurse (CRUD)

* GET /api/courses/:courseId/resources
* POST /api/courses/:courseId/resources
* GET /api/resources/:id
* PUT /api/resources/:id
* DELETE /api/resources/:id



Share pe Facebook

* POST /api/resources/:id/share/facebook



6\. Front-end SPA (React)

Pagini principale:

* Login
* Register
* Dashboard cu lista de cursuri
* Pagina cursului (lista resurse)
* Pagina pentru editare / adaugare resursa
* Buton pentru Share pe Facebook



Routing simplu:

* /login
* /register
* /courses
* /courses/:id



7\. Cerinte non-functionale

* Cod clar si usor de inteles, cu nume sugestive.
* Structura organizata pe module.
* Indentare clara.
* Optional: comentarii in zone mai complicate (ex: integrarea cu Facebook).
* Optional: testare unitara pe cateva endpoint-uri.



8\. Cum se incadreaza in cerintele proiectului

* Persistenta date (10%): User–Course–Resource, ORM, PostgreSQL.
* REST (25%): endpoint-uri CRUD corecte, JSON, coduri HTTP.
* Front-end SPA (25%): React + routing + componente.
* Autentificare (10%): JWT, restrictie acces date utilizator.
* Integrare serviciu extern: Facebook Graph API.
