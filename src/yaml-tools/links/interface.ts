import { ExtraYamlStuff } from "../schema/interface";

type RefLinkType = {
  operationRef: string;
  parameters: { [key: string]: string };
  requestBody: string;
  description: string;
  server: "";
} & ExtraYamlStuff;
type IdLinkType = {
  operationId: string;
  parameters: { [key: string]: string };
  requestBody: string;
  description: string;
  server: "";
} & ExtraYamlStuff;

export type LinkType = RefLinkType | IdLinkType;
