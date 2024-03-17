import { ExtraYamlStuff, TypeDeclaration } from "../schema/interface";
import { ExampleType } from "../example/interface";
import { HeadersObject } from "../headers/interface";
import { LinkType } from "../links/interface";
import { ParameterType } from "../parameters/interface";
import { RequestBodies } from "../requestBodies/interface";
import { ResponsesType } from "../responses/interface";
import { SecuritySchema } from "../securitySchemes/interface";

type SchemaStructure = { [key: string]: TypeDeclaration } & ExtraYamlStuff;
type ParameterStructure = { [key: string]: ParameterType } & ExtraYamlStuff;
type SecurityStructure = { [key: string]: SecuritySchema } & ExtraYamlStuff;
type RequestBodyStructure = { [key: string]: RequestBodies } & ExtraYamlStuff;
type ReponseStructure = {
  [key: string]: ResponsesType;
} & ExtraYamlStuff;
type HeaderStructure = { [key: string]: HeadersObject } & ExtraYamlStuff;
type ExampleStructure = { [key: string]: ExampleType } & ExtraYamlStuff;
type LinkStructure = { [key: string]: LinkType } & ExtraYamlStuff;
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
} & ExtraYamlStuff;
