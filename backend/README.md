# Forja API

Backend da plataforma Forja: **Node + Express + TypeScript + Prisma + PostgreSQL**,
com arquitetura em camadas (feature-based) e autenticação por JWT + refresh token.

## Stack

Express · TypeScript · Prisma ORM · SQLite (dev) / PostgreSQL (prod) ·
JWT (access + refresh rotativo) · bcryptjs · Zod (validação) · Helmet · CORS ·
cookie-parser.

## Rodando (zero setup — usa SQLite)

```bash
cd backend
npm install
cp .env.example .env     # já vem com DATABASE_URL de SQLite; ajuste os segredos JWT se quiser
npm run setup            # cria o banco (dev.db) + o admin cvdinizramos@gmail.com / Admin@123
npm run dev              # http://localhost:3333/api
```

Pronto — **não precisa instalar Postgres nem Docker**. O login funciona na hora.
Para popular cursos/planos de exemplo (opcional): `npm run seed`.

### Trocar para PostgreSQL em produção

O schema é portável. Em `prisma/schema.prisma` mude `provider = "sqlite"` para
`"postgresql"`, aponte a `DATABASE_URL` para seu Postgres e rode
`npm run prisma:generate && npm run prisma:migrate`. (Os campos `tags`/`features`
são armazenados como JSON string, compatível com ambos os bancos.)

> Se o banco estiver fora do ar, a API responde **503** com a mensagem "Banco de
> dados indisponível" — que aparece direto na tela de login.

## Arquitetura

```
src/
  config/       env (validado com Zod), prisma (client singleton)
  middlewares/  authenticate, authorize, validate, errorHandler
  modules/                      ← feature-based
    auth/       validators · repository · service · controller · routes
    courses/    validators · repository · service · controller · routes
  routes/       agrega as rotas em /api
  shared/       errors (AppError), http (asyncHandler), auth (tokens JWT)
  types/        augmentação do Request do Express (req.user)
  app.ts        monta o Express (helmet, cors, json, cookies, rotas, erros)
  server.ts     sobe o HTTP server + shutdown gracioso
prisma/
  schema.prisma modelagem completa (20+ modelos)
  seed.ts       dados iniciais
```

**Fluxo de uma request:** `route → validate(Zod) → [authenticate] → [authorize] →
controller → service (regras) → repository (Prisma)`. Erros sobem via
`asyncHandler` até o `errorHandler`, que normaliza AppError/ZodError em JSON.

## Endpoints já implementados

| Método | Rota                | Descrição                                | Auth |
| ------ | ------------------- | ---------------------------------------- | ---- |
| GET    | `/api/health`       | status do serviço                        | —    |
| POST   | `/api/auth/register`| cria conta (bcrypt + emite tokens)       | —    |
| POST   | `/api/auth/login`   | login                                    | —    |
| POST   | `/api/auth/refresh` | rotaciona o refresh token (cookie)       | cookie |
| POST   | `/api/auth/logout`  | revoga o refresh token                   | —    |
| GET    | `/api/auth/me`      | usuário autenticado                      | Bearer |
| GET    | `/api/courses`      | catálogo (busca, filtros, paginação)     | —    |
| GET    | `/api/courses/:slug`| curso + módulos/seções/aulas             | —    |

O refresh token vai em cookie **httpOnly** (`/api/auth`), guardado no banco como
hash SHA-256 e rotacionado a cada refresh. O access token (15 min) vai no corpo,
para o front enviar via header `Authorization: Bearer`.

## Modelo de dados (Prisma)

User · RefreshToken · VerificationToken · Category · Course · Module · Section ·
Lesson · Video · Material · Enrollment · LessonProgress · Certificate · Review ·
Comment · Favorite · Plan · Subscription · Notification · Event · Task — com os
relacionamentos e enums (Role, CourseLevel, LessonType, etc.).

## Próximos módulos

Seguindo o mesmo padrão: enrollments/progress, uploads (Multer), certificados
(PDF + QR), eventos, tasks (kanban), notificações, Google OAuth, e-mails (Resend)
e o painel admin.
```
