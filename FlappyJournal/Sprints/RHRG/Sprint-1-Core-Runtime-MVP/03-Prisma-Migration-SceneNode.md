# 03 – Prisma Migration: SceneNode

## Goal
Create a persistent, recursive SceneNode and FrameStat schema in PostgreSQL using Prisma, and generate migration scripts.

## Prerequisites
- PostgreSQL running locally or in dev environment
- `@prisma/client` and `prisma` npm packages installed
- Existing `prisma/schema.prisma` file

## Step-by-Step Instructions

1. **Extend Schema**
   - File: `prisma/schema.prisma`
   ```prisma
   model SceneNode {
     id        String   @id @default(uuid())
     sceneId   String
     type      String
     parentId  String?  @index
     payload   Json
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }

   model FrameStat {
     id         Int      @id @default(autoincrement())
     timestamp  DateTime @default(now()) @index
     fps        Float
     gpuMemMiB  Float
     overBudget Boolean
   }
   ```

2. **Generate Migration**
   ```sh
   npx prisma migrate dev --name add_scene_and_frame_stat
   ```

3. **Generate Recursive CTE View**
   - Add to migration file or as a separate SQL:
   ```sql
   CREATE OR REPLACE VIEW view_scene_node_hierarchy AS
   WITH RECURSIVE node_tree AS (
     SELECT id, parentId, sceneId, type, 1 as depth FROM "SceneNode" WHERE parentId IS NULL
     UNION ALL
     SELECT n.id, n.parentId, n.sceneId, n.type, nt.depth + 1
     FROM "SceneNode" n
     JOIN node_tree nt ON n.parentId = nt.id
   )
   SELECT * FROM node_tree;
   ```

4. **Update Prisma Client**
   ```sh
   npx prisma generate
   ```

5. **Write CRUD Service**
   - File: `server/holograph/scene/sceneNodeService.ts`
   - Implement create/update/delete/query for SceneNode.

## Verification & Acceptance Criteria
- [ ] Migration runs without error, tables and view created
- [ ] Can create SceneNode with arbitrary depth
- [ ] CRUD service covered by tests
- [ ] Integration test: insert 3-level tree, query hierarchy

## Time Estimate & Owner
- 1 day (DB/Backend)

## Common Pitfalls & Mitigations
- **Pitfall:** Breaking old data or migrations  
  **Mitigation:** Test migration in a throwaway DB first

- **Pitfall:** Recursive queries are slow  
  **Mitigation:** Index `parentId`, test with large trees

- **Pitfall:** Prisma client not updated  
  **Mitigation:** Always run `npx prisma generate` after schema changes