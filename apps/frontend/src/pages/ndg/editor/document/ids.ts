export const createNodeId = () => crypto.randomUUID();

export const createEdgeId = (sourceId: string, targetId: string) =>
  `${sourceId}__to__${targetId}`;
