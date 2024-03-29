export type YamlType =
  | number
  | string
  | boolean
  | YamlType[]
  | ({ [key: string]: YamlType } | ExtraYamlStuff);

export type YamlDict = { [key: string]: YamlType };
export type ExtraYamlStuff = { [key: `x-${string}`]: YamlType };
type ObjectDescriptor = YamlDict;
export type RefType = { $ref: string } & ExtraYamlStuff;
export type TypeDeclaration =
  | oneOfType
  | RefType
  | allOfType
  | anyOfType
  | ExplicitTypeDeclaration;
export type ExplicitTypeDeclaration = (
  | StringType
  | ArrayType
  | ObjectType
  | BooleanType
  | NumberType
  | IntegerType
) &
  ExtraYamlStuff;
export type oneOfType = { oneOf: TypeDeclaration[] } & ExtraYamlStuff;
export type anyOfType = { anyOf: TypeDeclaration[] } & ExtraYamlStuff;
export type allOfType = { allOf: TypeDeclaration[] } & ExtraYamlStuff;
export type CommonKeys = { nullable: boolean; title: string } & ExtraYamlStuff;
export type MinMaxLength = {
  minLength: number;
  maxLength: number;
};
type NumberRules = {
  exclusiveMinimum: boolean;
  exclusiveMaximum: boolean;
  maximum: number;
  minimum: number;
  multipleOf: number;
  default: number;
};
export type StringType = {
  type: "string";
  enum?: string | string[];
  format?: "date" | "date-time" | "password" | "byte" | "binary" | string;
  pattern?: string;
  default?: string;
} & Partial<MinMaxLength> &
  Partial<CommonKeys> &
  YamlDict;

type FileType = {
  type: "string";
  format: "base64" | "binary";
} & Partial<CommonKeys> &
  YamlDict;

export type BooleanType = {
  type: "boolean";
  default?: boolean;
} & Partial<CommonKeys> &
  YamlDict;

export type IntegerType = {
  type: "integer";
  format?: "int32" | "int64";
} & Partial<MinMaxLength> &
  Partial<CommonKeys> &
  Partial<NumberRules> &
  YamlDict;
export type NumberType = {
  type: "number";
  format?: "float" | "double";
} & Partial<MinMaxLength> &
  Partial<CommonKeys> &
  Partial<NumberRules> &
  YamlDict;

export type ArrayType = {
  type: "array";
  items?: TypeDeclaration;
  uniqueItems?: boolean;
  minItems?: number;
  maxItems?: number;
  default?: string | any[];
} & Partial<CommonKeys> &
  YamlDict;

export type ObjectType = {
  type: "object";
  properties?: { [key: string]: TypeDeclaration };
  required?: string[];
  additionalProperties?: boolean | {};
  minProperties?: number;
  maxProperties?: number;
  default?: { [key: string]: any };
} & Partial<CommonKeys> &
  YamlDict;

export function isPropertyDeclaration(
  entry: YamlType
): ExplicitTypeDeclaration | undefined {
  if (
    typeof entry === "object" &&
    !Array.isArray(entry) &&
    "type" in entry &&
    typeof entry["type"] === "string"
  )
    return entry as ExplicitTypeDeclaration;
  return undefined;
}

export function isSimpleStringType(entry: YamlType): StringType | undefined {
  const isObject = isPropertyDeclaration(entry);
  if (isObject?.type === "string") {
    return entry as StringType;
  }
  return undefined;
}
export function isPossibleFileType(entry: YamlType): FileType | undefined {
  if (process.env.NO_FILE == "true") return undefined;

  const isString = isSimpleStringType(entry);
  if (
    isString?.format &&
    (isString.format == "base64" || isString.format == "binary")
  )
    return isString as FileType;
  return undefined;
}

export function isBoolean(entry: YamlType): BooleanType | undefined {
  const isObject = isPropertyDeclaration(entry);
  if (isObject?.type == "boolean") return entry as BooleanType;
  return undefined;
}

export function isIntegerType(entry: YamlType): IntegerType | undefined {
  const isObject = isPropertyDeclaration(entry);
  if (isObject?.type == "integer") return entry as IntegerType;
  return undefined;
}
export function isNumberType(entry: YamlType): NumberType | undefined {
  const isObject = isPropertyDeclaration(entry);
  if (isObject?.type == "number") return entry as NumberType;
  return undefined;
}
export function isArrayType(entry: YamlType): ArrayType | undefined {
  const isObject = isPropertyDeclaration(entry);
  if (isObject?.type == "array") return entry as ArrayType;
  return undefined;
}
export function isObjectType(entry: YamlType): ObjectType | undefined {
  const isObject = isPropertyDeclaration(entry);
  if (isObject?.type == "object") return entry as ObjectType;
  return undefined;
}

export function typeDefine(root: ExplicitTypeDeclaration) {
  return root.type;
}

export function isEnum(root: StringType) {
  if (root.enum) {
    if (typeof root.enum === "string") {
      return root.enum
        .slice(1, root.enum.length - 1)
        .split(",")
        .map((key) => key.trim())
        .map((key) => `"${key}"`);
    } else {
      return root.enum.map((key) => `"${key}"`);
    }
  }
  return undefined;
}

export function stringDefiner(root: StringType) {
  if (isPossibleFileType(root)) return "File | string";
  const enumt = isEnum(root);
  if (enumt) return enumt.join(" | ");
  return "string";
}

export const typeFinder = {
  string: isSimpleStringType,
  boolean: isBoolean,
  integer: isIntegerType,
  number: isNumberType,
  array: isArrayType,
  object: isObjectType,
  isNullable: (d: YamlType) => {
    return isPropertyDeclaration(d)?.nullable;
  },
};
