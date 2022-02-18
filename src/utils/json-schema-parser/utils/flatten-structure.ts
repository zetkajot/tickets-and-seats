export default function flattenStructure(
  target: Record<string, any>,
): Map<string, any> {
  const resultingStructure: Map<string, any> = new Map();
  flatten(resultingStructure, target);
  return resultingStructure;
}

function flatten(
  flatStructure: Map<string, any>,
  target: Record<string, any>,
  ...nestedNames: string[]
) {
  const currentNestedTarget = resolveNestedProperty(target, ...nestedNames);
  Object
    .entries(currentNestedTarget)
    .forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        flatten(flatStructure, target, ...nestedNames, key);
      } else {
        flatStructure.set([...nestedNames, key].join('.'), value);
      }
    });
}

function resolveNestedProperty(target: Record<string, any>, ...nestedNames: string[]): any {
  if (nestedNames.length === 0) return target;
  let nestedProperty: Record<string, any> = { ...target };
  for (let idx = 0; idx < nestedNames.length; idx += 1) {
    nestedProperty = nestedProperty[nestedNames[idx]];
  }
  return nestedProperty;
}
