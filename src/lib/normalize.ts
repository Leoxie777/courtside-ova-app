import type { Match, MatchStatus, Team } from "./data";

export type Platform = "tourneymachine" | "volleyhub";

export const sampleCsv: Record<Platform, string> = {
  tourneymachine: `Date,Start Time,Court,Home Team,Away Team,Result
10/18/2026,1:30 PM,Court 2,Hamilton Spikers 16U,Ottawa Fusion 16U,
10/18/2026,3:00 PM,Court 1,Barrie Blaze 17U,Mississauga Titans 17U,25-19 23-25 15-12`,
  volleyhub: `match_datetime;location;team_a;team_b;state;scores
2026-10-18T16:30;C3;Windsor Waves 18U;Durham Attack 18U;scheduled;
2026-10-18T18:00;C1;London Lightning 16U;Toronto Thunder 16U;final;25:22|25:20`,
};

function parseRows(csv: string, sep: string): Record<string, string>[] {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  const head = (lines[0] ?? "").split(sep).map((h) => h.trim());
  return lines.slice(1).map((l) => {
    const cells = l.split(sep);
    const row: Record<string, string> = {};
    head.forEach((h, i) => (row[h] = (cells[i] ?? "").trim()));
    return new Proxy(row, { get: (t, k: string) => t[k] ?? "" });
  });
}

function to24(t: string) {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return t;
  let h = +m[1]! % 12;
  if (m[3]!.toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

function findTeam(name: string, teams: Team[]) {
  return teams.find((t) => t.name.toLowerCase() === name.toLowerCase())?.id ?? `ext:${name}`;
}

export function detectPlatform(csv: string): Platform {
  return (csv.split("\n")[0] ?? "").includes(";") ? "volleyhub" : "tourneymachine";
}

export function normalizeCsv(csv: string, platform: Platform, teams: Team[]): Match[] {
  if (platform === "tourneymachine") {
    return parseRows(csv, ",").map((r, i) => {
      const [mm = "", dd = "", yyyy = ""] = (r["Date"] ?? "").split("/");
      const sets = (r["Result"] ?? "") ? (r["Result"] ?? "").split(/\s+/).map((s) => s.split("-").map(Number) as [number, number]) : [];
      return {
        id: `tm-${Date.now()}-${i}`,
        date: `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`,
        time: to24((r["Start Time"] ?? "")),
        court: (r["Court"] ?? ""),
        homeId: findTeam((r["Home Team"] ?? ""), teams),
        awayId: findTeam((r["Away Team"] ?? ""), teams),
        status: (sets.length ? "final" : "scheduled") as MatchStatus,
        sets,
        source: "TourneyMachine",
      };
    });
  }
  return parseRows(csv, ";").map((r, i) => {
    const [date = "", time = ""] = (r["match_datetime"] ?? "").split("T");
    return {
      id: `vh-${Date.now()}-${i}`,
      date,
      time,
      court: (r["location"] ?? "").replace(/^C(\d+)$/, "Court $1"),
      homeId: findTeam((r["team_a"] ?? ""), teams),
      awayId: findTeam((r["team_b"] ?? ""), teams),
      status: (["live", "final"].includes((r["state"] ?? "")) ? (r["state"] ?? "") : "scheduled") as MatchStatus,
      sets: (r["scores"] ?? "") ? (r["scores"] ?? "").split("|").map((s) => s.split(":").map(Number) as [number, number]) : [],
      source: "VolleyHub",
    };
  });
}
