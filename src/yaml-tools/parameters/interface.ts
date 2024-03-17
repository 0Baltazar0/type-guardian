import {
  ExtraYamlStuff,
  RefType,
  TypeDeclaration,
  YamlDict,
  YamlType,
} from "../schema/interface";
import { ExampleType } from "../example/interface";
import { ContentEntry } from "../requestBodies/interface";

type ParameterRaw = {
  name: string;
  required?: boolean;
  description?: string;
  style: string;
  explode?: boolean;
  deprecated?: boolean;
  example: YamlType;
  examples: { [key: string]: ExampleType };
} & ExtraYamlStuff;

type ParameterSchema = ParameterRaw & { schema: TypeDeclaration };
type ParameterContent = ParameterRaw & { content: ContentEntry };
type ParameterBody = ParameterSchema | ParameterContent;

export type PathParameter = {
  in: "path";
  style?: "matrix" | "label" | "simple";
  required: true;
} & ParameterBody;
export type QueryParameter = {
  in: "query";
  style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
  allowReserved?: boolean;
  allowEmptyValue?: true;
} & ParameterBody;
export type HeaderParameter = {
  in: "header";
  style?: "simple";
} & ParameterBody;
export type CookieParameter = {
  in: "cookie";
  style?: "form";
} & ParameterBody;
export type TrueParameterType =
  | CookieParameter
  | HeaderParameter
  | QueryParameter
  | PathParameter;

export type ParameterType = TrueParameterType | RefType;

export function isPathType(root: YamlDict) {
  if (
    "in" in root &&
    root["in"] == "path" &&
    "name" in root &&
    typeof root["name"] == "string"
  )
    return root as PathParameter;
}
export function isQueryType(root: YamlDict) {
  if (
    "in" in root &&
    root["in"] == "query" &&
    "name" in root &&
    typeof root["name"] == "string"
  )
    return root as PathParameter;
}
export function isHeaderType(root: YamlDict) {
  if (
    "in" in root &&
    root["in"] == "header" &&
    "name" in root &&
    typeof root["name"] == "string"
  )
    return root as PathParameter;
}
export function isCookieType(root: YamlDict) {
  if (
    "in" in root &&
    root["in"] == "cookie" &&
    "name" in root &&
    typeof root["name"] == "string"
  )
    return root as PathParameter;
}
