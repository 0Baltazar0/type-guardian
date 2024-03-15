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

export const a = { b: { d: {} } };

export class LookUpBundler {
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
  getLines() {
    return this.dataLines.join("\n");
  }
  dump(fileNamePath: string, data: string) {
    const pathTo = join(fileNamePath, "../");
    console.log(`source=${fileNamePath} directory=${pathTo}`);
    mkdirSync(pathTo, { recursive: true });
    writeFileSync(fileNamePath, data, {
      encoding: "utf-8",
    });
  }
  compile() {
    this.dataLines.push(
      "const lookupJson = " + this.source.getAsJson() + " as const"
    );
    this.dump(this.destFile, this.dataLines.join("\n"));
  }

  static async from_file_or_files(source: string, dest: string, cache: string) {
    const sourceStat = await stat(source);

    if (sourceStat.isFile()) {
      return [
        new LookUpBundler(
          new Preformatter(source),
          join(
            dest,
            basename(source, extname(source)),
            basename(source, extname(source)) + ".lookup.ts"
          ),
          cache
        ),
      ];
    } else {
      const sourceFiles = await readdir(source);

      return sourceFiles
        .filter((src) => src.endsWith(".yaml") || src.endsWith(".yml"))
        .map((src) => {
          return new LookUpBundler(
            new Preformatter(join(source, src)),
            join(
              dest,
              basename(source, extname(source)),
              basename(source, extname(source)) + ".lookup.ts"
            ),
            cache
          );
        });
    }
  }
}
