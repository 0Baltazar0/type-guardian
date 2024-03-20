import { ZodAny } from "zod";
export { YAMLDocumentStructure } from "./yaml-tools/YamlDomStructure";
export interface DescriptorPath<Data> {
  [key: string]: Descriptor<Data>["PathObject"];
}

export interface Descriptor<Data extends any | ZodAny> {
  requestBody: { [key: string]: Data };
  parameters: {
    path?: { [key: string]: Data };
    query?: { [key: string]: Data };
    cookies?: { [key: string]: Data };
    headers?: { [key: string]: Data };
  };
  responses: { [key: string]: Data | Descriptor<Data>["requestBody"] };
  OperationObject: {
    requestBody?: Descriptor<Data>["requestBody"];
    responses: Descriptor<Data>["responses"];
    parameters?: Descriptor<Data>["parameters"];
  };
  PathObject: {
    [key: string]: Descriptor<Data>["OperationObject"];
  };
  paths: { [key: string]: Descriptor<Data>["PathObject"] };
}
