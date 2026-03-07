export type TransformPipeline = {
  mode: 'staged';
};

export function createTransformPipeline(): TransformPipeline {
  return {
    mode: 'staged',
  };
}
