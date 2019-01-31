import { Operators } from "./utils";

const regionEuropeProperty = {
  parameter: "region",
  operator: "is",
  value: "Europe"
};

const regionAsiaProperty = {
  parameter: "region",
  operator: "is",
  value: "Asia"
};

const sizeNotSmallProperty = {
  parameter: "size",
  operator: "isNot",
  value: "small"
};

const sizeIsMediumProperty = {
  parameter: "size",
  operator: "is",
  value: "medium"
};

const sizeIsSmallProperty = {
  parameter: "size",
  operator: "is",
  value: "medium"
};

const mockRegionPropertyGroup = {
  operator: Operators.or,
  properties: [regionEuropeProperty, regionAsiaProperty, sizeNotSmallProperty]
};

const regionNotNorthAmericaProperty = {
  parameter: "region",
  operator: "isNot",
  value: "North America"
};

const mockSizePropertyGroup = {
  operator: Operators.or,
  properties: [
    sizeIsMediumProperty,
    sizeIsSmallProperty,
    regionNotNorthAmericaProperty
  ]
};

const mockCombinedGroups = {
  andGroups: [mockRegionPropertyGroup, mockSizePropertyGroup]
};
