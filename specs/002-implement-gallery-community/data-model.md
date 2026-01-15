# Data Model: Gallery Community

## Entities

### User (Reference)
*Existing entity from Auth module*
- `id`: string (UUID)
- `name`: string
- `role`: 'student' | 'mentor' | 'admin'
- `avatar`: string (URL/Base64)

### Artwork
- `id`: string (UUID)
- `authorId`: string (FK -> User.id)
- `title`: string
- `description`: string
- `imageUrl`: string (Base64 data URL for Phase 1)
- `createdAt`: string (ISO 8601)
- `likeCount`: number (Cached count for display)

### Comment
- `id`: string (UUID)
- `artworkId`: string (FK -> Artwork.id)
- `authorId`: string (FK -> User.id)
- `content`: string
- `createdAt`: string (ISO 8601)

### Like (Join Table)
- `userId`: string (FK -> User.id)
- `artworkId`: string (FK -> Artwork.id)
- `createdAt`: string (ISO 8601)

### Scrap (Join Table)
- `userId`: string (FK -> User.id)
- `artworkId`: string (FK -> Artwork.id)
- `createdAt`: string (ISO 8601)

## Relationships

- **User** 1 -- * **Artwork**
- **User** 1 -- * **Comment**
- **Artwork** 1 -- * **Comment**
- **User** * -- * **Artwork** (via Like)
- **User** * -- * **Artwork** (via Scrap)
