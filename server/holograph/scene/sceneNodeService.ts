import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MAX_DEPTH = 10;

export async function createSceneNode(data: {
  sceneId: string;
  type: string;
  parentId?: string;
  payload: any;
}) {
  if (data.parentId) {
    const ancestors = await prisma.$queryRaw`
      WITH RECURSIVE ancestors AS (
        SELECT id, "parentId", 1 as depth
        FROM "SceneNode"
        WHERE id = ${data.parentId}
        UNION ALL
        SELECT n.id, n."parentId", a.depth + 1
        FROM "SceneNode" n
        JOIN ancestors a ON n."parentId" = a.id
      )
      SELECT depth FROM ancestors ORDER BY depth DESC LIMIT 1
    `;
    if (ancestors[0] && ancestors[0].depth >= MAX_DEPTH) {
      throw new Error('Scene graph depth limit exceeded');
    }
  }
  return prisma.sceneNode.create({ data });
}

export async function getSceneNode(id: string) {
  return prisma.sceneNode.findUnique({ where: { id } });
}

export async function updateSceneNode(id: string, data: {
  type?: string;
  payload?: any;
}) {
  return prisma.sceneNode.update({ where: { id }, data });
}

export async function deleteSceneNode(id: string) {
  return prisma.sceneNode.delete({ where: { id } });
}

export async function getSceneNodeHierarchy(sceneId: string) {
  return prisma.$queryRaw`SELECT * FROM view_scene_node_hierarchy WHERE "sceneId" = ${sceneId}`;
}

export function getSceneMaxDepth(nodes: { parentId: string | null }[]): number {
  const nodeMap = new Map(nodes.map((node: any) => [node.id, node]));
  let maxDepth = 0;

  for (const node of nodes) {
    let depth = 1;
    let currentNode: any = node;
    while (currentNode.parentId) {
      currentNode = nodeMap.get(currentNode.parentId);
      if (!currentNode) break;
      depth++;
    }
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  }

  return maxDepth;
}