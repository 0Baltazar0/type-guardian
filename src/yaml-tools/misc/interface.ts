import { ExtraYamlStuff } from "../schema/interface";

export type ExternalDocsStructure = {
  description?: string;
  url: string;
} & ExtraYamlStuff;
