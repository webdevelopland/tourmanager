import { Routing } from "./Routing";

describe("Routing", () => {
  beforeEach(() => {
    this.routing = new Routing();
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
    this.routing.load(json);
  });
  it("Routing is working", () => {
    expect(this.routing.towns.length).toBe(2);
  });
});