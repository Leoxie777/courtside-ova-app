import { describe, expect, it } from "vitest";
import { players, rosterFor, toAppTeamId } from "./rosters";

describe("rosters", () => {
  it("imports all 100 CSV players", () => expect(players.length).toBe(100));
  it("has 10 players per team", () => {
    for (let i = 1; i <= 10; i++) expect(rosterFor(`t${i}`).length).toBe(10);
  });
  it("maps T001 to t1 and rejects unknown teams", () => {
    expect(toAppTeamId("T001")).toBe("t1");
    expect(toAppTeamId("T099")).toBeNull();
  });
  it("keeps Emma Chen as #1 Setter on Toronto Thunder", () => {
    expect(rosterFor("t1")[0]).toMatchObject({ number: 1, name: "Emma Chen", position: "Setter" });
  });
});
