declare module "d3-hierarchy" {
  export interface HierarchyNode<Datum> {
    data: Datum;
    value?: number;
    children?: Array<HierarchyNode<Datum>>;
    sum(value: (datum: Datum) => number): this;
    sort(compare: (a: HierarchyNode<Datum>, b: HierarchyNode<Datum>) => number): this;
  }

  export interface HierarchyCircularNode<Datum> extends HierarchyNode<Datum> {
    x: number;
    y: number;
    r: number;
    children?: Array<HierarchyCircularNode<Datum>>;
    leaves(): Array<HierarchyCircularNode<Datum>>;
  }

  export function hierarchy<Datum>(data: Datum): HierarchyNode<Datum>;

  export function pack<Datum>(): {
    size(size: [number, number]): this;
    padding(padding: number): this;
    (root: HierarchyNode<Datum>): HierarchyCircularNode<Datum>;
  };
}
