import pkg from "../../package.json";

import { describe, expect, it } from "vitest";

describe("package smoke", () => {
  it("declares an MIT package with an sbti binary and import entry", () => {
    expect(pkg.license).toBe("MIT");
    expect(pkg.bin.sbti).toBe("dist/bin/sbti.js");
    expect(pkg.exports["."].import).toBe("./dist/index.js");
  });
});
