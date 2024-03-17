import { ZodAny } from "zod";

export interface ZodHelpers {
  requestBody: { [key: string]: ZodAny };
  parameters: {
    path?: { [key: string]: ZodAny };
    query?: { [key: string]: ZodAny };
    cookies?: { [key: string]: ZodAny };
    headers?: { [key: string]: ZodAny };
  };
  responses: { [key: string]: ZodAny };
  OperationObject: {
    requestBody?: ZodHelpers["requestBody"];
    responses: ZodHelpers["responses"];
    parameters?: ZodHelpers["parameters"];
  };
  PathObject: {
    [key: string]: ZodHelpers["OperationObject"];
  };
  paths: { [key: string]: ZodHelpers["PathObject"] };
}
