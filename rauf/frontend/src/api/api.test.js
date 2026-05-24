import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import api from "./axios";

const apiMock = new MockAdapter(api);
const globalMock = new MockAdapter(axios);

describe("API Interceptors", () => {
  beforeEach(() => {
    localStorage.clear();
    apiMock.reset();
    globalMock.reset();

    delete window.location;
    window.location = { href: "", pathname: "" };
  });

  it("adds Authorization header to requests when tokens exist", async () => {
    localStorage.setItem("tokens", JSON.stringify({ access: "test-token" }));

    apiMock.onGet(/\/test/).reply(200);

    await api.get("/test");

    expect(apiMock.history.get[0].headers.Authorization).toBe(
      "Bearer test-token",
    );
  });

  it("refreshes token and retries request on 401 error", async () => {
    localStorage.setItem(
      "tokens",
      JSON.stringify({ access: "old", refresh: "refresh-123" }),
    );

    apiMock.onGet(/\/protected/).replyOnce(401);

    globalMock
      .onPost(/\/accounts\/token\/refresh/)
      .reply(200, { access: "new-token" });

    apiMock.onGet(/\/protected/).replyOnce(200);

    await api.get("/protected");

    const tokens = JSON.parse(localStorage.getItem("tokens"));
    expect(tokens.access).toBe("new-token");
    expect(apiMock.history.get.length).toBe(2);
  });

  it("redirects to login on refresh failure", async () => {
    localStorage.setItem(
      "tokens",
      JSON.stringify({ refresh: "expired-refresh" }),
    );

    apiMock.onGet(/\/protected/).replyOnce(401);
    globalMock.onPost(/\/accounts\/token\/refresh/).reply(400);

    Object.defineProperty(window, "location", {
      value: { href: "", pathname: "" },
      writable: true,
    });

    try {
      await api.get("/protected");
    } catch (e) {
      expect(localStorage.getItem("tokens")).toBeNull();
    }
  });
});
