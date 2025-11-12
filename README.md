# Notes App - Full Stack Application

Aplicación completa de notas con backend API REST y frontend interactivo construida con Next.js, MySQL y TypeScript.

## 🚀 Características

- ✅ Crear, leer y actualizar notas
- ✅ API REST con validación (Yup)
- ✅ Frontend con TanStack Query
- ✅ Tests unitarios y de integración (37 tests)
- ✅ Tema oscuro
- ✅ Docker para desarrollo
- ✅ Repository Pattern + Singleton

## 📋 Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- Git

## 🛠️ Setup

### Opción 1: Docker (Recomendado)

```bash
# Clonar e instalar
git clone https://github.com/Zamyr/ADSO-Note.git
cd ADSO-Note/notes-app

# Levantar MySQL + App
docker compose up -d

# Ver logs
docker compose logs app -f
```

La app estará en: **http://localhost:3000**

### Opción 2: Local

```bash
# Instalar dependencias
npm install

# Crear .env
echo 'DATABASE_URL="mysql://notes_user:notes_password@localhost:3306/notes_db"' > .env

# Levantar solo MySQL
docker compose up mysql -d

# Generar Prisma y crear tablas
npx prisma generate
npx prisma db push

# Iniciar desarrollo
npm run dev
```

## 🧪 Tests

```bash
# Todos los tests
npm test

# Por categoría
npx jest tests/unit tests/integration    # Backend (8 tests)
npx jest tests/components tests/pages     # Frontend (29 tests)
```

## 📁 Estructura

```
notes-app/
├── app/
│   ├── api/
│   │   ├── notes/route.ts              # POST /api/notes, GET /api/notes
│   │   └── note/[id]/route.ts          # GET, PATCH /api/note/:id
│   ├── components/
│   │   ├── NoteCard.tsx
│   │   └── NoteForm.tsx
│   └── notes/
│       ├── page.tsx                    # Lista
│       ├── new/page.tsx                # Crear
│       └── [id]/edit/page.tsx          # Editar
├── lib/
│   ├── repositories/
│   │   └── NoteRepository.ts           # Repository Pattern
│   ├── hooks/                          # TanStack Query hooks
│   ├── validators/                     # Esquemas Yup
│   └── types/
└── tests/
    ├── unit/                           # Repository tests
    ├── integration/                    # API tests
    ├── components/                     # Component tests
    └── pages/                          # Page tests
```

## 📊 API Endpoints

### POST /api/notes
```json
// Request
{"title": "Mi Nota", "content": "Contenido"}

// Response (201)
{"id": 1}
```

### GET /api/notes
```json
// Response (200)
[
  {
    "id": 1,
    "title": "Mi Nota",
    "content": "Contenido",
    "createdAt": "2025-11-12T03:44:30.818Z",
    "updatedAt": "2025-11-12T03:44:30.818Z"
  }
]
```

### GET /api/note/:id
```json
// Response (200)
{"id": 1, "title": "Mi Nota", ...}

// Response (404)
{"error": "Note not found"}
```

### PATCH /api/note/:id
```json
// Request
{"title": "Actualizado", "content": "Nuevo contenido"}

// Response (200)
{"id": 1, "title": "Actualizado", ...}
```

## 🏗️ Stack Tecnológico

| Tech | Justificación |
|------|---------------|
| **Next.js 16** | App Router, RSC, API Routes integradas |
| **TypeScript** | Type safety, mejor DX |
| **MySQL 8.0** | ACID compliance, robustez |
| **Prisma** | ORM type-safe, migrations |
| **TanStack Query** | Cache inteligente, sincronización |
| **Yup** | Validación compartida FE/BE |
| **Jest** | Testing estándar |
| **Docker** | Portabilidad, ambiente consistente |

## 🎯 Escalabilidad

### 1. Base de Datos
- **Índices**: `CREATE INDEX idx_notes_created_at ON notes(created_at DESC)`
- **Paginación cursor-based**: `GET /api/notes?cursor=123&limit=20`
- **Read replicas**: Maestro para escrituras, réplicas para lecturas
- **Sharding**: Por `user_id` si multi-tenant

### 2. Caching
- **Redis** para queries frecuentes (TTL 60s)
- **CDN** para assets estáticos (Cloudflare/CloudFront)
- **Invalidación** en mutations

### 3. Backend
- **Load Balancer** (Nginx) con múltiples instancias
- **Auto-scaling** con Kubernetes (HPA)
- **Health checks**: `/api/health`

### 4. Full-Text Search
- **Elasticsearch** para búsquedas en contenido
- **Multi-match queries** con boost en título

### 5. Monitoreo
- **APM**: Sentry (errores), DataDog (métricas)
- **Logging**: Winston + ELK Stack
- **Alertas**: Latencia > 500ms, Error rate > 1%

### 6. Frontend
- **Code splitting**: Lazy loading de páginas
- **Infinite scroll** con TanStack Query
- **Optimistic updates** para mejor UX

## 🔒 Seguridad

**Implementado**:
- ✅ Validación de entrada (Yup)
- ✅ Type safety (TypeScript)
- ✅ Prepared statements (Prisma)

**Para producción**:
- [ ] Autenticación (JWT/OAuth)
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Helmet.js
- [ ] Input sanitization

## 📝 Decisiones de Arquitectura

### Repository Pattern
Abstraer acceso a datos:
```typescript
class NoteRepository {
  async create(data) { /* Prisma */ }
  async findAll() { /* ... */ }
}
```
**Ventajas**: Desacoplamiento, fácil testing, cambiar ORM sin afectar API

### Singleton
Una instancia compartida:
```typescript
static getInstance(): NoteRepository {
  if (!instance) instance = new NoteRepository();
  return instance;
}
```
**Ventajas**: Evita múltiples conexiones, control centralizado

### Custom Hooks
Encapsular TanStack Query:
```typescript
export const useNotes = () => useQuery({
  queryKey: ['notes'],
  queryFn: fetchNotes
});
```
**Ventajas**: Reutilización, testing simple, separación de concerns

### Validación Compartida
Mismos esquemas Yup en FE y BE:
```typescript
export const createNoteSchema = yup.object({
  title: yup.string().required().max(255),
  content: yup.string().required()
});
```
**Ventajas**: DRY, consistencia, mensajes unificados

## 👨‍💻 Autor

Zamyr - [GitHub](https://github.com/Zamyr)
