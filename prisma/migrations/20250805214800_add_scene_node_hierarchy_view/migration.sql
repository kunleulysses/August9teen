CREATE OR REPLACE VIEW view_scene_node_hierarchy AS
WITH RECURSIVE node_tree AS (
  SELECT id, "parentId", "sceneId", type, 1 as depth FROM "SceneNode" WHERE "parentId" IS NULL
  UNION ALL
  SELECT n.id, n."parentId", n."sceneId", n.type, nt.depth + 1
  FROM "SceneNode" n
  JOIN node_tree nt ON n."parentId" = nt.id
)
SELECT * FROM node_tree;