import { ComponentsObject } from "./collectors/YamlComponents";
import { PathObject, PathStructure } from "./collectors/YamlPaths";
import { ExtraYamlStuff } from "./schema/interface";
import { SecurityRequirements } from "./securitySchemes/interface";
import { ServerObject } from "./server/interface";

export type YAMLDocumentStructure = {
  openapi: string;
  servers?: ServerObject[];
  paths?: PathStructure;
  components?: ComponentsObject;
  security?: SecurityRequirements[];
} & ExtraYamlStuff;
