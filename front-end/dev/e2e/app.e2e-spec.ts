import { browser } from "protractor";

describe("angular-cli", () => {

  it("default test", () => {
    var project = "angular"
    expect(project).toEqual("angular");
  });

});
