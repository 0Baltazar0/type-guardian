import { YamlDict } from "../yaml-tools/schema/interface";

export class JSchemaReformatter {
  private base;
  private source;
  constructor(title: string, source: YamlDict) {
    this.source = source;
    this.base = {
      properties: {},
      type: "object",
      required: [],
      title,
      components: source["components"] ?? {},
    };
  }

  compilePaths() {}
}
