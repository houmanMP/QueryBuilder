import isUndefined from "lodash/isUndefined";
import faker from "faker";

export const Operators = {
  and: "and",
  or: "or"
};

const Sizes = ["small", "medium", "large"];
const Regions = ["Asia", "Europe", "North America"];

export const createCompany = () => ({
  name: faker.name.findName(),
  region:
    Regions[
      faker.random.number({
        min: 0,
        max: 2
      })
    ],
  size:
    Sizes[
      faker.random.number({
        min: 0,
        max: 2
      })
    ]
});

export const conditionIsUndefined = condition =>
  isUndefined(condition) ||
  isUndefined(condition.properties) ||
  isUndefined(condition.properties.parameter) ||
  isUndefined(condition.properties.operator) ||
  isUndefined(condition.properties.value);

export const combineConditionGroups = groups =>
  groups.reduce(
    (combinedGroups, group) => {
      const { andGroups, orGroups } = combinedGroups;
      const properties = group.conditions
        .filter(condition => !conditionIsUndefined(condition))
        .map(({ properties }) => properties);

      if (properties.length === 0) {
        return combinedGroups;
      }

      const propertyGroup = {
        operator: group.operator,
        properties: properties
      };

      if (group.outerOperator === Operators.or) {
        return {
          andGroups,
          orGroups: [...orGroups, propertyGroup]
        };
      } else {
        return {
          andGroups: [...andGroups, propertyGroup],
          orGroups
        };
      }
    },
    {
      andGroups: [],
      orGroups: []
    }
  );

const PropertyOperators = {
  is: "is",
  isNot: "isNot"
};

const _validateProperty = company => ({ parameter, operator, value }) =>
  operator === PropertyOperators.is
    ? company[parameter] === value
    : company[parameter] !== value;

const _validatePropertyGroup = company => ({ operator, properties }) => {
  const validateProperty = _validateProperty(company);
  if (operator === Operators.or && properties.find(validateProperty)) {
    return true;
  }

  const invalidateProperty = property => !validateProperty(property);
  return Boolean(!properties.find(invalidateProperty));
};

export const validateCombinedGroups = company => ({
  andGroups = [],
  orGroups = []
}) => {
  const validatePropertyGroup = _validatePropertyGroup(company);
  if (orGroups.find(validatePropertyGroup)) {
    return true;
  }

  const invalidatePropertyGroup = propertyGroup =>
    !validatePropertyGroup(propertyGroup);
  return Boolean(!andGroups.find(invalidatePropertyGroup));
};
