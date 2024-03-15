import { stat, readdir } from "fs/promises";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { basename, join, extname } from "path";
import { parse, stringify } from "yaml";
import { Preformatter } from "../yaml-tools/preformatter";
import { YAMLDocumentStructure } from "../yaml-tools/YamlDomStructure";
import {
  OperationObject,
  PathObject,
} from "../yaml-tools/collectors/YamlPaths";
import {
  CookieParameter,
  HeaderParameter,
  ParameterType,
  PathParameter,
  QueryParameter,
  TrueParameterType,
} from "../yaml-tools/parameters/interface";
import {
  ArrayType,
  ExplicitTypeDeclaration,
  ObjectType,
  RefType,
  TypeDeclaration,
  stringDefiner,
} from "../yaml-tools/schema/interface";
import {
  ContentEntry,
  RequestBodies,
} from "../yaml-tools/requestBodies/interface";
import {
  ResponsesType,
  TrueResponseType,
} from "../yaml-tools/responses/interface";
type YamlType =
  | number
  | string
  | boolean
  | YamlType[]
  | { [key: string]: YamlType };

type YamlDict = { [key: string]: YamlType };

interface InternalStructure {
  paths: {
    [key: string]: {
      [key: string]: {
        parameters?: {
          query?: { [key: string]: any };
          path?: { [key: string]: any };
        };
        requestBody?: { [key: string]: any };
        responses?: { [key: string]: any };
      };
    };
  };
}

export class InterfaceBundler {
  private sourceFile;
  private destFile;
  private cacheDest;
  private source: Preformatter;
  private dataLines: string[] = [];
  constructor(preFormatter: Preformatter, destFile: string, cacheDest: string) {
    this.sourceFile = preFormatter.getSourceFile();
    this.destFile = destFile;
    this.source = preFormatter;
    this.cacheDest = cacheDest;
  }
  refSanity(ref: string) {
    return ref.split("#/")[0].length == 0;
  }
  unWindRef(ref: string | YamlType): YamlDict {
    if (typeof ref != "string") throw Error("");
    const refData = this.source.goToLocalRef(
      ref.split("/").filter((_, i) => i > 0)
    );
    if ("$ref" in refData) {
      return this.unWindRef(refData["$ref"]);
    }
    return refData;
  }

  unWindTypeDeclaration(root: TypeDeclaration): string {
    if ("type" in root == false) {
      if ("oneOf" in root) {
        return root.oneOf
          .map((td) => this.unWindTypeDeclaration(td))
          .join(" | ");
      }
      if ("anyOf" in root) {
        return root.anyOf
          .map((td) => this.unWindTypeDeclaration(td))
          .join(" | ");
      }
      if ("allOf" in root) {
        return root.allOf
          .map((td) => this.unWindTypeDeclaration(td))
          .join(" & ");
      }
      if ("$ref" in root) {
        return this.refToComponent(root["$ref"]);
      }
    } else {
      return this.unWindSchemaType(root);
    }
    return "any";
  }

  unWindObject(root: ObjectType) {
    const props = root.properties;
    if (props) {
      const required = root.required;
      const values = Object.keys(props).map<[string, string]>((key) => {
        return [key, this.unWindTypeDeclaration(props[key])];
      });
      return `{ ${values
        .map((v) => {
          return `${v[0]}${required?.includes(v[0]) ? "" : "?"}:${v[1]}`;
        })
        .join(",")}}`;
    }
    return "{[key:string]:any}";
  }

  unWindArray(root: ArrayType) {
    if (root.items) {
      return `${this.unWindTypeDeclaration(root.items)}[]`;
    }
    return "any[]";
  }

  unWindSchemaType(root: ExplicitTypeDeclaration) {
    switch (root.type) {
      case "object":
        return this.unWindObject(root);
      case "array":
        return this.unWindArray(root);
      case "string":
        return stringDefiner(root);
    }
    return root.type;
  }

  quickMap(d: [string, string][]) {
    return d.map((kv) => `${kv[0]}:${kv[1]}`).join(";");
  }

  translateComponents(): string {
    const root = this.source.getRootLevelKey("components");
    const componentLines: string[] = [];
    if (root?.schemas) {
      const schemas = root.schemas;
      const testRes = this.quickMap(
        Object.keys(schemas).map<[string, string]>((key) => {
          return [key, this.unWindTypeDeclaration(schemas[key])];
        })
      );

      componentLines.push(`schemas:{${testRes}}`);
    }
    if (root?.parameters) {
      componentLines.push(
        `parameters:{${this.quickMap(
          Object.keys(root.parameters).map((key) => {
            return [key, this.unWindParameter(root["parameters"]![key])];
          })
        )}}`
      );
    }
    if (root?.requestBodies) {
      componentLines.push(
        `requestBodies:{${this.quickMap(
          Object.keys(root.requestBodies).map((key) => {
            return [
              key,
              this.unWindContentEntry(root["requestBodies"]![key].content),
            ];
          })
        )}}`
      );
    }
    if (root?.headers) {
      componentLines.push(
        `headers:{${this.quickMap(
          Object.keys(root.headers).map((key) => {
            const header = root["headers"]![key] as HeaderParameter;
            if ("schema" in header) {
              return [key, this.unWindTypeDeclaration(header.schema)];
            }
            if ("content" in header && header.content) {
              return [key, this.unWindContentEntry(header.content)];
            }
            throw Error("Non conforming header!");
          })
        )}}`
      );
    }
    if (root?.responses) {
      componentLines.push(
        `responses:{${this.quickMap(
          Object.keys(root.responses).map((key) => {
            return [key, this.unWindResponseEntry(root["responses"]![key])];
          })
        )}}`
      );
    }
    return `interface components {${componentLines.join(";")}}`;
  }
  dumpToCache(filename: string, data: string) {
    mkdirSync(this.cacheDest, { recursive: true });
    writeFileSync(join(this.cacheDest, filename), data, {
      encoding: "utf-8",
    });
  }

  splitRef(ref: string) {
    return ref.split("/").filter((_r, i) => i > 0);
  }

  goToBottomRef<T = YamlDict>(ref: string): T {
    const path = this.splitRef(ref);
    const data = this.source.goToLocalRef(path);
    if ("$ref" in data) {
      return this.goToBottomRef(data["$ref"] as string);
    }
    return data as T;
  }

  getTrueRoot<T extends YamlDict>(root: T | RefType): T {
    if ("$ref" in root) {
      return this.goToBottomRef<T>(root["$ref"] as string);
    }
    return root;
  }

  unwindOperationObjectParameters(root: OperationObject, context: PathObject) {
    const localParameters =
      root.parameters?.map(
        (par) =>
          [
            this.getTrueRoot<TrueParameterType>(par),
            this.unWindParameter(par),
          ] as [TrueParameterType, string]
      ) ?? [];
    const externalParameters =
      context.parameters
        ?.map(
          (par) =>
            [
              this.getTrueRoot<TrueParameterType>(par),
              this.unWindParameter(par),
            ] as [TrueParameterType, string]
        )
        .filter(
          (par) =>
            par[0].name in localParameters.map((lp) => lp[0].name) == false
        ) ?? [];
    const mergedParameters = externalParameters.concat(localParameters);

    if (mergedParameters.length > 0) {
      const pathString = mergedParameters
        .filter((par) => par[0].in == "path")
        .map((par) => `${par[0].name}:${par[1]}`)
        .join(";");
      const headerString = mergedParameters
        .filter((par) => par[0].in == "header")
        .map(
          (par) =>
            `${par[0].name}${par[0].required == true ? "" : "?"}:${par[1]}`
        )
        .join(";");
      const cookieString = mergedParameters
        .filter((par) => par[0].in == "cookie")
        .map(
          (par) =>
            `${par[0].name}${par[0].required == true ? "" : "?"}:${par[1]}`
        )
        .join(";");
      const queryString = mergedParameters
        .filter((par) => par[0].in == "query")
        .map(
          (par) =>
            `${par[0].name}${par[0].required == true ? "" : "?"}:${par[1]}${
              (par[0] as QueryParameter).allowEmptyValue == true ? "| null" : ""
            }`
        )
        .join(";");
      const required = mergedParameters
        .map((par) => par[0].required == true)
        .some((p) => p == true);
      return `parameters${required == true ? "" : "?"}:{${
        queryString.length > 0 ? `query:{${queryString}};` : ""
      }${pathString.length > 0 ? `path:{${pathString}};` : ""}${
        cookieString.length > 0 ? `cookie:{${cookieString}};` : ""
      }${headerString.length > 0 ? `header:{${headerString}};` : ""} }`;
    }
    return undefined;
  }
  refToComponent(ref: string) {
    return (
      "components" +
      ref
        .split("/")
        .filter((_s, i) => i > 1)
        .map((key) => `["${key}"]`)
        .join("")
    );
  }

  unWindRequestBody(root: RequestBodies | RefType): string {
    const data = this.getTrueRoot(root);
    const required = data.required == true;
    if ("$ref" in root)
      return `requestBody${required == true ? "" : "?"}:${this.refToComponent(
        root.$ref
      )}`;

    return `requestBody${
      required == true ? "" : "?"
    }: ${this.unWindContentEntry(root.content)}`;
  }

  unWindResponse(root: OperationObject) {
    return `responses: {${Object.keys(root.responses)
      .map((key) => {
        const data = this.getTrueRoot<TrueResponseType>(root.responses[key]);
        const content = data.content
          ? this.unWindContentEntry(data.content)
          : "any";
        return `"${key}": ${content}`;
      })
      .join(" ; ")}}`;
  }

  unWindOperationObject(root: OperationObject, context: PathObject) {
    const lines: string[] = [];
    const parameters = this.unwindOperationObjectParameters(root, context);
    if (parameters) lines.push(parameters);
    const body = root.requestBody
      ? this.unWindRequestBody(root.requestBody)
      : undefined;
    if (body) lines.push(body);
    lines.push(this.unWindResponse(root));

    return `{${lines.join(" ; ")}}`;
  }

  unWindPaths(root: PathObject) {
    const lines: string[] = [];
    if (root.get)
      lines.push(`get:${this.unWindOperationObject(root.get, root)}`);
    if (root.put)
      lines.push(`put:${this.unWindOperationObject(root.put, root)}`);
    if (root.post)
      lines.push(`post:${this.unWindOperationObject(root.post, root)}`);
    if (root.delete)
      lines.push(`delete:${this.unWindOperationObject(root.delete, root)}`);
    if (root.options)
      lines.push(`options:${this.unWindOperationObject(root.options, root)}`);
    if (root.head)
      lines.push(`head:${this.unWindOperationObject(root.head, root)}`);
    if (root.patch)
      lines.push(`patch:${this.unWindOperationObject(root.patch, root)}`);
    if (root.trace)
      lines.push(`trace:${this.unWindOperationObject(root.trace, root)}`);

    return `{${lines.join(";")}}`;
  }
  translatePaths(): string | undefined {
    const paths = this.source.getRootLevelKey("paths");
    if (paths) {
      return `export interface paths {${Object.keys(paths)
        .map((key) => {
          return `"${key}":${this.unWindPaths(paths[key])}`;
        })
        .join(";")}}`;
    }
    return undefined;
  }

  unWindContentEntry(root: ContentEntry): string {
    return `{${Object.keys(root)
      .map((k) => {
        const data = root[k];
        return `"${k}":${this.unWindTypeDeclaration(data.schema)}`;
      })
      .join(" ; ")}}`;
  }

  unWindResponseEntry(root: ResponsesType): string {
    if ("$ref" in root) {
      return this.unWindResponseEntry(
        this.goToBottomRef<ResponsesType>(root["$ref"])
      );
    } else {
      return root.content ? this.unWindContentEntry(root.content) : "any";
    }
  }

  unWindParameter(root: ParameterType): string {
    if ("$ref" in root) {
      return this.unWindParameter(
        this.source.goToLocalRef(this.splitRef(root["$ref"])) as ParameterType
      );
    }
    if ("schema" in root && root.schema) {
      return this.unWindTypeDeclaration(root.schema);
    }
    if ("content" in root && root.content) {
      return this.unWindContentEntry(root.content);
    }
    throw Error("No content or schema!");
  }
  saveToCache() {
    this.dumpToCache(
      basename(this.sourceFile, extname(this.sourceFile)) + ".ts",
      this.dataLines.join("\n")
    );
  }
  compile() {
    this.source.removeRemote();
    const components = this.translateComponents();
    this.dataLines.push(components);
    const paths = this.translatePaths();
    if (paths) this.dataLines.push(paths);
    // this.saveToCache();
    this.dump(this.destFile, this.dataLines.join("\n"));
  }

  testPreCompile() {
    this.source.removeRemote();
    const source = this.source.dumpCurrentSource();

    mkdirSync(this.cacheDest, { recursive: true });
    writeFileSync(
      join(this.cacheDest, this.sourceFile + ".test.yaml"),
      source,
      {
        encoding: "utf-8",
      }
    );
    this.dumpToCache(
      basename(this.sourceFile, extname(this.sourceFile)) + ".ts",
      this.translateComponents()
    );
  }
  dump(fileNamePath: string, data: string) {
    const pathTo = join(fileNamePath, "../");
    mkdirSync(pathTo, { recursive: true });
    writeFileSync(fileNamePath, data, {
      encoding: "utf-8",
    });
  }
  static async from_file_or_files(source: string, dest: string, cache: string) {
    const sourceStat = await stat(source);

    if (sourceStat.isFile()) {
      return [
        new InterfaceBundler(
          new Preformatter(source),
          join(
            dest,
            basename(source, extname(source)),
            basename(source, extname(source)) + ".interface.ts"
          ),
          cache
        ),
      ];
    } else {
      const sourceFiles = await readdir(source);

      return sourceFiles
        .filter((src) => src.endsWith(".yaml") || src.endsWith(".yml"))
        .map((src) => {
          return new InterfaceBundler(
            new Preformatter(join(source, src)),
            join(
              dest,
              basename(source, extname(source)),
              basename(source, extname(source)) + ".interface.ts"
            ),
            cache
          );
        });
    }
  }
}
