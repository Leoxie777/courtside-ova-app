import { describe, it, expect } from "vitest";
import { normalizeCsv, sampleCsv, detectPlatform } from "./normalize";
import { teams } from "./data";

describe("normalizeCsv", () => {
  it("normalizes TourneyMachine rows", () => {
    const m = normalizeCsv(sampleCsv.tourneymachine, "tourneymachine", teams);
    expect(m[0]).toMatchObject({ date: "2026-10-18", time: "13:30", court: "Court 2", homeId: "t3", awayId: "t2", status: "scheduled" });
    expect(m[1]!.sets).toEqual([[25, 19], [23, 25], [15, 12]]);
  });
  it("normalizes VolleyHub rows", () => {
    const m = normalizeCsv(sampleCsv.volleyhub, "volleyhub", teams);
    expect(m[1]).toMatchObject({ date: "2026-10-18", time: "18:00", court: "Court 1", homeId: "t4", awayId: "t1", status: "final" });
    expect(detectPlatform(sampleCsv.volleyhub)).toBe("volleyhub");
  });
});
