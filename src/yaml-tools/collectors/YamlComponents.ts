import { TypeDeclaration } from "../schema/interface";
import { ExampleType } from "../example/interface";
import { HeadersObject } from "../headers/interface";
import { LinkType } from "../links/interface";
import { ParameterType } from "../parameters/interface";
import { RequestBodies } from "../requestBodies/interface";
import { ResponsesType } from "../responses/interface";
import { SecuritySchema } from "../securitySchemes/interface";

type SchemaStructure = { [key: string]: TypeDeclaration };
type ParameterStructure = { [key: string]: ParameterType };
type SecurityStructure = { [key: string]: SecuritySchema };
type RequestBodyStructure = { [key: string]: RequestBodies };
type ReponseStructure = {
  [key: string]: ResponsesType;
};
type HeaderStructure = { [key: string]: HeadersObject };
type ExampleStructure = { [key: string]: ExampleType };
type LinkStructure = { [key: string]: LinkType };
export type ComponentsObject = {
  schemas?: SchemaStructure;
  parameters?: ParameterStructure;
  securitySchemes?: SecurityStructure;
  requestBodies?: RequestBodyStructure;
  responses?: ReponseStructure;
  headers?: HeaderStructure;
  examples?: ExampleStructure;
  links?: LinkStructure;
  callbacks?: {};
};
