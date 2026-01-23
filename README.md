                                        #Learning Resources Manager - Documentatie
Descriere Aplicatie
Learning Resources Manager este o aplicatie web care permite utilizatorilor sa isi organizeze resursele de invatare online (articole, video-uri, cursuri) si sa le distribuie pe Facebook.

Video-ul privind descrierea aplicatiei se regasteste la urmatorul link: https://youtu.be/PuLdPUjuGyc

Functionalitati principale:
Inregistrare si autentificare utilizatori
Creare si gestionare cursuri
Adaugare resurse de invatare in cursuri
Distribuire resurse pe Facebook
Acces securizat - fiecare utilizator vede doar propriile date


Cerinte Sistem
Inainte de instalare, asigura-te ca ai instalate:

Node.js (versiunea 20 sau mai noua)

Download: https://nodejs.org/
Verifica instalarea: node --version


PostgreSQL (versiunea 16 sau mai noua)

Download: https://www.postgresql.org/download/
Noteaza parola setata la instalare!


Instalare si Configurare
Pasul 1: Pregateste Proiectul
Descarca proiectul si extrage arhiva intr-un folder
Deschide folderul in VS Code:

File → Open Folder → selecteaza folderul proiectului


Pasul 2: Porneste PostgreSQL
Windows:

Apasa Windows + R
Scrie services.msc si apasa Enter
Gaseste "PostgreSQL Server" in lista
Click dreapta → Start (daca nu ruleaza deja)

Verifica ca statusul este "Running"

Pasul 3: Configureaza Backend
Deschide terminalul in VS Code (Ctrl + `)
Navigheaza in folderul backend:
bashcd backend
Instaleaza dependintele:
bashnpm install
Asteptare: ~1-2 minute (se instaleaza pachete necesare)

Pasul 4: Creaza Fisierul de Configurare
In folderul backend, creaza un fisier numit .env
Continut fisier .env:
envPORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:PAROLA_TA@localhost:5432/learning_resources?schema=public"

JWT_SECRET=secret_key_pentru_jwt_tokens_schimba_in_productie

FACEBOOK_APP_ID=id_aplicatie_facebook
FACEBOOK_APP_SECRET=secret_aplicatie_facebook
FACEBOOK_PAGE_TOKEN=token_pagina_facebook
FACEBOOK_PAGE_ID=id_pagina_facebook
IMPORTANT: Inlocuieste PAROLA_TA cu parola PostgreSQL pe care ai setat-o la instalare!
Exemplu:
envDATABASE_URL="postgresql://postgres:postgres123@localhost:5432/learning_resources?schema=public"
Salveaza fisierul (Ctrl + S)

Pasul 5: Creaza Baza de Date
In terminal (tot in folderul backend), ruleaza:
bashnpx prisma migrate dev --name init
```

**Ce se intampla:**
- Se creaza baza de date `learning_resources`
- Se creaza tabelele: users, courses, resources, share_events
- Se genereaza Prisma Client

**Mesaj de succes:**
```
Your database is now in sync with your schema.
✔ Generated Prisma Client

Pasul 6: Configureaza Frontend
Deschide un TERMINAL NOU (click pe + in panoul terminal)
Navigheaza in folderul frontend:
bashcd frontend
Instaleaza dependintele:
bashnpm install

Pornirea Aplicatiei
Trebuie sa rulezi 2 terminale simultan:
Terminal 1 - Backend (API Server)
bashcd backend
node server.js
```

**Mesaj asteptat:**
```
Server running on port 5000
Nu inchide acest terminal!

Terminal 2 - Frontend (React App)
Deschide terminal nou (click pe +)
bashcd frontend
npm start
```

**Mesaj asteptat:**
```
Compiled successfully!
Local: http://localhost:3000
```

**Browser-ul se va deschide automat** la adresa `http://localhost:3000`

---

## Utilizarea Aplicatiei

### 1. Inregistrare Utilizator

- Aplicatia se deschide pe pagina de Login
- Click pe link-ul **"Register"**
- Completeaza formularul:
  - **Name:** numele tau
  - **Email:** adresa de email
  - **Password:** o parola (minim 6 caractere)
- Click **"Register"**

Vei fi redirectionat automat la dashboard dupa inregistrare.

---

### 2. Autentificare

Daca ai deja cont:
- Completeaza **Email** si **Password**
- Click **"Login"**

**Token-ul JWT** este salvat automat in browser, deci ramai autentificat chiar si dupa refresh.

---

### 3. Gestionare Cursuri

**Dashboard (pagina principala dupa login):**

**Creare curs nou:**
1. Click butonul **"Add New Course"**
2. Completeaza:
   - **Course Title:** numele cursului (ex: "Web Development")
   - **Description:** descriere scurta (optional)
3. Click **"Create Course"**

**Stergere curs:**
- Click butonul **"Delete"** pe cursul dorit
- Confirma stergerea
- **Atentie:** Se sterg si toate resursele din acel curs!

**Vizualizare resurse:**
- Click **"View Resources"** pe un curs pentru a vedea resursele

---

### 4. Gestionare Resurse

**Dupa ce dai click pe "View Resources":**

**Adaugare resursa noua:**
1. Click **"Add New Resource"**
2. Completeaza formularul:
   - **Title:** titlul resursei (ex: "React Documentation")
   - **URL:** link-ul catre resursa (ex: https://react.dev)
   - **Type:** alege tipul din dropdown
     - Article (articol)
     - Video
     - Link
     - Document
   - **Description:** descriere scurta (optional)
3. Click **"Add Resource"**

**Stergere resursa:**
- Click **"Delete"** pe resursa dorita
- Confirma stergerea

**Distribuire pe Facebook:**
- Click **"Share on Facebook"** pe o resursa
- Resursa va fi postata pe pagina ta Facebook (necesita configurare)
- Actiunea este salvata in baza de date (tabelul share_events)

---

### 5. Navigare

**Meniu principal:**
- Click **"← Back to Courses"** pentru a reveni la dashboard
- Click **"Logout"** pentru a te deconecta

---

## Arhitectura Aplicatiei

### Backend (Node.js + Express)

**Structura:**
```
backend/
├── controllers/           Logica business
│   ├── authController.js      Inregistrare, login
│   ├── courseController.js    CRUD cursuri
│   └── resourceController.js  CRUD resurse, share Facebook
├── middleware/
│   └── auth.js               Verificare JWT token
├── routes/
│   ├── auth.js              Rute autentificare
│   ├── courses.js           Rute cursuri
│   └── resources.js         Rute resurse
├── prisma/
│   └── schema.prisma        Schema baza de date
├── .env                     Configurare (creezi manual)
├── server.js               Server principal
└── package.json            Dependinte
```

### Frontend (React)

**Structura:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.js        Pagina login
│   │   ├── Register.js     Pagina inregistrare
│   │   ├── Courses.js      Dashboard cursuri
│   │   └── Resources.js    Pagina resurse curs
│   ├── services/
│   │   └── api.js         Functii apeluri API
│   ├── App.js             Routing principal
│   ├── index.js           Entry point
│   └── index.css          Stiluri
└── package.json           Dependinte
```

## Baza de Date

**PostgreSQL cu Prisma ORM**

**Tabele:**

**1. users** - Utilizatori aplicatie
- id (INT, primary key)
- name (STRING)
- email (STRING, unique)
- password (STRING, hash-uit)
- createdAt (DATETIME)

**2. courses** - Cursuri create de utilizatori
- id (INT, primary key)
- userId (INT, foreign key → users)
- title (STRING)
- description (STRING, optional)
- createdAt (DATETIME)

**3. resources** - Resurse de invatare
- id (INT, primary key)
- courseId (INT, foreign key → courses)
- title (STRING)
- url (STRING)
- type (STRING: article/video/link/document)
- description (STRING, optional)
- createdAt (DATETIME)

**4. share_events** - Log-uri distribuiri Facebook
- id (INT, primary key)
- resourceId (INT, foreign key → resources)
- userId (INT, foreign key → users)
- status (STRING: SUCCESS/FAILED)
- createdAt (DATETIME)

**Relatii:**
- Un user poate avea multiple cursuri
- Un curs poate avea multiple resurse
- O resursa poate avea multiple share events

**Cascading delete:**
- Daca stergi un user → se sterg toate cursurile lui
- Daca stergi un curs → se sterg toate resursele lui
- Daca stergi o resursa → se sterg toate share events-urile ei

---

## Securitate si Autentificare

**JWT (JSON Web Tokens):**
- La login/register, serverul genereaza un token JWT
- Token-ul contine ID-ul utilizatorului, criptat
- Token-ul este valid 7 zile
- Frontend-ul salveaza token-ul in localStorage
- Token-ul este trimis automat la fiecare request catre API

**Middleware de autentificare:**
- Verifica prezenta token-ului in header-ul request-ului
- Valideaza token-ul cu JWT_SECRET
- Extrage userId din token
- Permite accesul la ruta protejata doar daca token-ul e valid

**Protectie date:**
- Fiecare user vede doar propriile cursuri si resurse
- La fiecare operatie, backend-ul verifica ca resursa apartine utilizatorului
- Parolele sunt hash-uite cu bcrypt (nu se salveaza plain text)

---

## Integrare Facebook Graph API

**Functionalitate:** Distribuirea resurselor pe pagina Facebook

**Cerinte:**
1. Cont Facebook Developer
2. Aplicatie Facebook creata
3. Permisiuni necesare:
   - `pages_manage_posts` - postare pe pagini
   - `pages_read_engagement` - citire info pagini
   - `pages_show_list` - lista pagini

**Obtinere token:**
1. Mergi la https://developers.facebook.com/tools/explorer/
2. Selecteaza aplicatia ta
3. Genereaza Access Token cu permisiunile de mai sus
4. Pentru a posta pe pagina: `GET /me/accounts` pentru Page Token
5. Adauga token-ul in `.env`

**Cum functioneaza:**
- Utilizatorul da click pe "Share on Facebook"
- Backend-ul face un POST request la Facebook Graph API
- Se posteaza un mesaj cu titlul si link-ul resursei
- Rezultatul (SUCCESS/FAILED) se salveaza in tabela share_events
