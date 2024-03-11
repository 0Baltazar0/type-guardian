import { YamlType } from "../schema/interface";

type InlineExampleType = {
  summary: string;
  description: string;
  value: YamlType;
};
type ExternalExampleType = {
  summary: string;
  description: string;
  externalValue: string;
};
export type ExampleType = ExternalExampleType | InlineExampleType;
