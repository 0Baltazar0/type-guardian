import {
  ExtraYamlStuff,
  RefType,
  TypeDeclaration,
  YamlType,
} from "../schema/interface";
import { HeadersObject } from "../headers/interface";
type EncodingObject = {
  contentType?: string;
  headers?: { [key: string]: HeadersObject | RefType };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
} & ExtraYamlStuff;
type MediaTypeObject = {
  schema: TypeDeclaration;
  example?: YamlType;
  examples?: { [key: string]: YamlType };
  encoding?: { [key: string]: EncodingObject };
} & ExtraYamlStuff;
export type ContentEntry = { [key: string]: MediaTypeObject } & ExtraYamlStuff;
export type RequestBodies = {
  description?: string;
  required?: boolean;
  content: ContentEntry;
} & ExtraYamlStuff;
