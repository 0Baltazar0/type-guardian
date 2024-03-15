import { stat, readdir } from "fs/promises";
import { readFileSync, writeFileSync } from "fs";
import { basename, join, extname } from "path";
import { parse, stringify } from "yaml";
import { YamlDict, YamlType } from "./schema/interface";
import { YAMLDocumentStructure } from "./YamlDomStructure";

export class Preformatter {
  private sourceFile;
  private sourceYaml: YAMLDocumentStructure;
  constructor(sourceFile: string) {
    this.sourceFile = sourceFile;
    this.sourceYaml = parse(
      readFileSync(this.sourceFile, { encoding: "utf-8" })
    );
    this.removeRemote();
  }

  getSourceFile() {
    return this.sourceFile;
  }
  getRootLevelKey<T extends keyof YAMLDocumentStructure>(
    key: T
  ): YAMLDocumentStructure[T] {
    return this.sourceYaml[key];
  }
  getAsJson() {
    return JSON.stringify(this.sourceYaml);
  }
  isLocalRef(ref: string) {
    return ref.split("#/")[0].length == 0;
  }

  goToGlobalRef(ref: string) {
    const pathToRef = ref.split("#/")[0];
    const remoteRoot = parse(
      readFileSync(join(this.sourceFile, "../" + pathToRef), {
        encoding: "utf-8",
      })
    ) as YamlDict;
    return this.goToLocalRef(ref.split("#/")[1].split("/"), remoteRoot);
  }

  mergeGlobalRef(refs: string[], root: YamlDict = this.sourceYaml) {
    const isPresent = refs.reduce<YamlDict | undefined>((res, curr) => {
      if (typeof res !== "object" || curr in res == false) {
        return undefined;
      }
      const resCurr = res[curr];
      if (typeof resCurr === "object" && !Array.isArray(resCurr)) {
        return resCurr;
      } else {
        return undefined;
      }
    }, this.sourceYaml);
    if (isPresent == undefined) {
      return refs.reduce<YamlDict>((res, curr, index, arr) => {
        if (index == arr.length - 1) {
          res[curr] = root;
          return root;
        }

        if (typeof res[curr] !== "object") {
          res[curr] = {};
          return res[curr] as YamlDict;
        } else {
          return res[curr] as YamlDict;
        }
      }, this.sourceYaml);
    }
    return isPresent;
  }

  goToLocalRef(refs: string[], root: YamlDict = this.sourceYaml) {
    return refs.reduce<YamlDict>((res, curr) => {
      if (
        typeof res !== "object" ||
        curr in res == false ||
        Array.isArray(res)
      ) {
        throw Error("Bad ref!" + JSON.stringify(refs));
      }
      const resCurr = res[curr];
      if (typeof resCurr === "object" && !Array.isArray(resCurr)) {
        return resCurr;
      } else {
        throw Error("Bad ref!" + JSON.stringify(refs));
      }
    }, root);
  }

  fetchRef(ref: string) {
    if (this.isLocalRef(ref)) {
      return this.goToLocalRef(
        ref.split("/").filter((r, i) => i > 0),
        this.sourceYaml
      );
    }
    const globalRef = this.goToGlobalRef(ref);
    return this.mergeGlobalRef(ref.split("#/")[1].split("/"), globalRef);
  }

  prefetchRecursiveArray(root: YamlType[]): boolean {
    return root
      .map((item) => {
        if (Array.isArray(item)) return this.prefetchRecursiveArray(item);
        else if (typeof item === "object")
          return this.prefetchRecursiveObject(item);
        else return false;
      })
      .some((it) => it === true);
  }

  prefetchRecursiveObject(root: YamlDict): boolean {
    return Object.keys(root)
      .map((key) => {
        if (key == "$ref") {
          const ref = root[key];
          if (typeof ref != "string") {
            throw Error("Ref is not string!");
          }
          const local = this.isLocalRef(ref);
          if (local) return false;
          this.fetchRef(ref);
          root[key] = "#/" + ref.split("#/")[1];
          return true;
        }
        const item = root[key];
        if (Array.isArray(item)) return this.prefetchRecursiveArray(item);
        else if (typeof item === "object")
          return this.prefetchRecursiveObject(item);
        else return false;
      })
      .some((pro) => pro === true);
  }

  prefetchRemoteResourcesRecursive() {
    let cycle = 0;
    while (this.prefetchRecursiveObject(this.sourceYaml) == true) {
      console.log("cycle:" + ++cycle);
    }
  }

  dumpCurrentSource() {
    const res = stringify(this.sourceYaml);
    return res;
  }

  removeRemote() {
    this.prefetchRemoteResourcesRecursive();
  }
}
