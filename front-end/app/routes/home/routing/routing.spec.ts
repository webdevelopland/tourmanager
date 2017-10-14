import { Routing } from "./routing";

describe("Routing", () => {
  var routing;
  beforeEach(() => {
    routing = new Routing();
    var json = {
      deals: [
        {
          cost: 100, discount: 50,
          arrival: "London", departure: "Paris",
          duration: { h:1, m:30 },
          code: "AXDE177", transport: "bus"
        }
      ]
    };
    routing.load(json);
  });
  it("should works", () => {
    expect(routing).toBeTruthy();
  });
  it("should cheap search", () => {
    var result = routing.cheapStart("London", "Paris");
    expect(result).toBeTruthy();
  });
  it("should fast search", () => {
    var result = routing.fastStart("London", "Paris");
    expect(result).toBeTruthy();
  });
});