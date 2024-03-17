import { ExtraYamlStuff } from "../schema/interface";

type ServerVariables = {
  enum?: string[];
  default: string;
  description?: string;
} & ExtraYamlStuff;
export type ServerObject = {
  url: string;
  description?: string;
  variables?: { [key: string]: ServerVariables };
} & ExtraYamlStuff;
