import { ExtraYamlStuff, YamlType } from "../schema/interface";

type InlineExampleType = {
  summary: string;
  description: string;
  value: YamlType;
} & ExtraYamlStuff;
type ExternalExampleType = {
  summary: string;
  description: string;
  externalValue: string;
} & ExtraYamlStuff;
export type ExampleType = ExternalExampleType | InlineExampleType;
