import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface ChangelogEntry {
  version: string;
  date: string;
  sections: {
    added?: string[];
    changed?: string[];
    deprecated?: string[];
    removed?: string[];
    fixed?: string[];
    security?: string[];
  };
  rawContent: string;
}

export interface ParsedChangelog {
  entries: ChangelogEntry[];
  lastUpdated: string;
  repoUrl: string;
}

// Hämta CHANGELOG.md från repository
export async function getChangelogFromFile(
  owner: string,
  repo: string,
): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: "CHANGELOG.md",
    });

    if ("content" in data) {
      return Buffer.from(data.content, "base64").toString("utf8");
    }
    return "";
  } catch (error) {
    console.error(`Error fetching changelog from ${owner}/${repo}:`, error);
    return "";
  }
}

// Hämta senaste commit-datum för CHANGELOG.md
async function getChangelogLastModified(
  owner: string,
  repo: string,
): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      path: "CHANGELOG.md",
      per_page: 1,
    });

    return data[0]?.commit.author?.date || new Date().toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

// Parsa CHANGELOG.md innehåll till strukturerat format
function parseChangelog(content: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = content.split("\n");

  let currentEntry: Partial<ChangelogEntry> | null = null;
  let currentSection: string | null = null;
  let rawContent: string[] = [];

  for (const line of lines) {
    // Hitta version headers (## [version] - datum)
    const versionMatch = line.match(/^##\s*\[([^\]]+)\]\s*-\s*(.+)$/);
    if (versionMatch) {
      // Spara föregående entry om den finns
      if (currentEntry && currentEntry.version) {
        entries.push({
          ...currentEntry,
          rawContent: rawContent.join("\n").trim(),
        } as ChangelogEntry);
      }

      // Starta ny entry
      currentEntry = {
        version: versionMatch[1],
        date: versionMatch[2],
        sections: {}, // Initialize sections object
      };
      rawContent = [line];
      currentSection = null;
      continue;
    }

    // Hoppa över om vi inte har en aktiv entry
    if (!currentEntry) continue;

    rawContent.push(line);

    // Hitta sektions-headers (### Added, ### Changed, etc.)
    const sectionMatch = line.match(
      /^###\s+(Added|Changed|Deprecated|Removed|Fixed|Security)$/i,
    );
    if (sectionMatch) {
      currentSection = sectionMatch[1].toLowerCase();
      // Ensure sections object exists before accessing it
      if (
        currentEntry.sections &&
        !currentEntry.sections[
          currentSection as keyof typeof currentEntry.sections
        ]
      ) {
        (currentEntry.sections as any)[currentSection] = [];
      }
      continue;
    }

    // Lägg till list items till aktuell sektion
    const listMatch = line.match(/^-\s+(.+)$/);
    if (listMatch && currentSection && currentEntry.sections) {
      const section = (currentEntry.sections as any)[currentSection];
      if (Array.isArray(section)) {
        section.push(listMatch[1]);
      }
    }
  }

  // Lägg till sista entry
  if (currentEntry && currentEntry.version) {
    entries.push({
      ...currentEntry,
      rawContent: rawContent.join("\n").trim(),
    } as ChangelogEntry);
  }

  return entries;
}

// Hämta och parsa API changelog
export async function getApiChangelog(): Promise<ParsedChangelog> {
  const owner = "Diavana-dev";
  const repo = "system-backend";

  try {
    const [content, lastUpdated] = await Promise.all([
      getChangelogFromFile(owner, repo),
      getChangelogLastModified(owner, repo),
    ]);

    const entries = parseChangelog(content);

    return {
      entries,
      lastUpdated,
      repoUrl: `https://github.com/${owner}/main/${repo}`,
    };
  } catch (error) {
    console.error("Error fetching API changelog:", error);
    return {
      entries: [],
      lastUpdated: new Date().toISOString(),
      repoUrl: "",
    };
  }
}

// Hämta och parsa App changelog
export async function getAppChangelog(): Promise<ParsedChangelog> {
  const owner = "Diavana-dev";
  const repo = "system-frontend";

  try {
    const [content, lastUpdated] = await Promise.all([
      getChangelogFromFile(owner, repo),
      getChangelogLastModified(owner, repo),
    ]);

    const entries = parseChangelog(content);

    return {
      entries,
      lastUpdated,
      repoUrl: `https://github.com/${owner}/${repo}`,
    };
  } catch (error) {
    console.error("Error fetching App changelog:", error);
    return {
      entries: [],
      lastUpdated: new Date().toISOString(),
      repoUrl: "",
    };
  }
}
