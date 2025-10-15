import { slugify } from "@/utils/slugify";

type RoleKey = string;

type RoleLike = {
  role: string;
  roleKey?: string | null;
};

type PriorityLike = {
  priority?: number | null;
};

type ChapterLike = {
  affiliation?: string | null;
  chapter?: string | null;
};

export const advisorRoleOrder: RoleKey[] = ["chief-advisor", "executive-advisor", "advisor", "counselor"];

export const studentRoleOrder: RoleKey[] = [
  "chairperson",
  "vice-chairperson",
  "general-secretary",
  "joint-general-secretary",
  "treasurer",
  "webmaster"
];

export const chapterAdvisorRoleOrder: RoleKey[] = ["chapter-advisor", "chapter-co-advisor", "advisor", "counselor"];

export function resolveRoleKey<T extends RoleLike>(member: T): RoleKey {
  if (member.roleKey && member.roleKey !== "none") {
    return member.roleKey;
  }

  const normalized = member.role.toLowerCase();

  if (normalized.includes("chief") && normalized.includes("advisor")) {
    return "chief-advisor";
  }
  if (normalized.includes("executive") && normalized.includes("advisor")) {
    return "executive-advisor";
  }
  if (normalized.includes("co-advisor") || normalized.includes("co advisor")) {
    return "chapter-co-advisor";
  }
  if (normalized.includes("advisor") && normalized.includes("counselor")) {
    return "counselor";
  }
  if (normalized.includes("advisor")) {
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-advisor" : "advisor";
  }
  if (normalized.includes("counselor")) {
    return "counselor";
  }
  if (normalized.includes("chairperson") || normalized.includes("chair")) {
    if (normalized.includes("vice")) {
      return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-vice-chair" : "vice-chairperson";
    }
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-chair" : "chairperson";
  }
  if (normalized.includes("vice chair")) {
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-vice-chair" : "vice-chairperson";
  }
  if (normalized.includes("general secretary") && normalized.includes("joint")) {
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-joint-secretary" : "joint-general-secretary";
  }
  if (normalized.includes("general secretary") || normalized.includes("secretary")) {
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-secretary" : "general-secretary";
  }
  if (normalized.includes("treasurer")) {
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-treasurer" : "treasurer";
  }
  if (normalized.includes("web") && normalized.includes("master")) {
    return normalized.includes("chapter") || normalized.includes("affinity") ? "chapter-webmaster" : "webmaster";
  }
  if (normalized.includes("committee")) {
    return "chapter-committee";
  }
  return "none";
}

const priorityValue = (value?: number | null) => (typeof value === "number" ? value : 0);

export function sortByRoleOrder<T extends RoleLike & PriorityLike>(order: RoleKey[]) {
  return (a: T, b: T) => {
    const aKey = resolveRoleKey(a);
    const bKey = resolveRoleKey(b);
    const aIndex = order.includes(aKey) ? order.indexOf(aKey) : order.length;
    const bIndex = order.includes(bKey) ? order.indexOf(bKey) : order.length;
    const orderDiff = aIndex - bIndex;
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return priorityValue(b.priority) - priorityValue(a.priority);
  };
}

export function sortByPriority<T extends PriorityLike>(members: T[]): T[] {
  return [...members].sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority));
}

export const chapterFallbackName = "Student Branch Chapter";

export type ChapterGroup<T> = {
  name: string;
  slug: string;
  advisors: T[];
  committee: T[];
  members: T[];
};

export function groupChapterMembers<T extends RoleLike & PriorityLike & ChapterLike>(members: T[]): ChapterGroup<T>[] {
  const chapterMembers = members.filter((member) => (member.affiliation ?? "main") === "chapter");
  const groups = new Map<string, T[]>();

  chapterMembers.forEach((member) => {
    const key = member.chapter?.trim() || chapterFallbackName;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(member);
  });

  return Array.from(groups.entries())
    .map(([name, groupMembers]) => {
      const advisors = groupMembers
        .filter((member) => chapterAdvisorRoleOrder.includes(resolveRoleKey(member)))
        .sort(sortByRoleOrder(chapterAdvisorRoleOrder));
      const committee = groupMembers.filter((member) => !chapterAdvisorRoleOrder.includes(resolveRoleKey(member)));
      return {
        name,
        slug: slugify(name),
        advisors,
        committee: sortByPriority(committee),
        members: sortByPriority(groupMembers)
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
