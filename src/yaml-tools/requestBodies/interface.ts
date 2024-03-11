import { RefType, TypeDeclaration, YamlType } from "../schema/interface";
import { HeadersObject } from "../headers/interface";
type EncodingObject = {
  contentType?: string;
  headers?: { [key: string]: HeadersObject | RefType };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
};
type MediaTypeObject = {
  schema: TypeDeclaration;
  example?: YamlType;
  examples: { [key: string]: YamlType };
  encoding: { [key: string]: EncodingObject };
};
export type ContentEntry = { [key: string]: MediaTypeObject };
export type RequestBodies = {
  description?: string;
  required?: boolean;
  content: ContentEntry;
};
