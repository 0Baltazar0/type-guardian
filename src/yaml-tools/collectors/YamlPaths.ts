import { RefType } from "../schema/interface";
import { ExternalDocsStructure } from "../misc/interface";
import { ParameterType } from "../parameters/interface";
import { RequestBodies } from "../requestBodies/interface";
import { ResponsesType } from "../responses/interface";
import { SecurityRequirements } from "../securitySchemes/interface";
import { ServerObject } from "../server/interface";

export type OperationObject = {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocsStructure;
  operationId?: string;
  parameters?: ParameterType[];
  requestBody?: RequestBodies | RefType;
  responses: { [key: string]: ResponsesType; default: ResponsesType };
  deprecated?: boolean;
  security?: SecurityRequirements[];
  servers?: ServerObject[];
};

export type PathObject = {
  summary?: string;
  description?: string;
  servers?: ServerObject[];
  parameters?: ParameterType[];
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
};
export type PathStructure = {
  [key: string]: PathObject;
};
