export interface filterOptions {
  property: string;
  filterOptions: subFilterOption[];
}

export interface subFilterOption {
  operation: string;
  value: number | number[];
}
