export function groupToMap<K, V>(array: V[], key: (v: V) => K): Map<K, V[]> {
  return array.reduce((map: Map<K, V[]>, v: V) => {
    const k = key(v);
    let l: V[];
    if (!map.has(k)) {
      l = [];
      map.set(k, l);
    } else {
      l = map.get(k)!;
    }
    l.push(v);
    return map;
  }, new Map<K, V[]>());
}