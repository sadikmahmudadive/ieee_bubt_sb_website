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
  const includesAdvisor = normalized.includes("advisor") || normalized.includes("adviser");
  const includesCoAdvisor =
    normalized.includes("co-advisor") || normalized.includes("co advisor") || normalized.includes("co-adviser") || normalized.includes("co adviser");
  const includesCounselor =
    normalized.includes("counselor") ||
    normalized.includes("counsellor") ||
    normalized.includes("councillor") ||
    normalized.includes("counsilor") ||
    normalized.includes("councellor") ||
    normalized.includes("councelor") ||
    normalized.includes("councilor");
  const includesChapter = normalized.includes("chapter") || normalized.includes("affinity");
  const includesChief = normalized.includes("chief");
  const includesExecutive = normalized.includes("executive");

  if (includesChief && includesAdvisor) {
    return "chief-advisor";
  }
  if (includesExecutive && includesAdvisor) {
    return "executive-advisor";
  }
  if (includesCoAdvisor) {
    return "chapter-co-advisor";
  }
  if (includesAdvisor && includesCounselor) {
    return "counselor";
  }
  if (includesAdvisor) {
    return includesChapter ? "chapter-advisor" : "advisor";
  }
  if (includesCounselor) {
    return "counselor";
  }
  if (normalized.includes("chairperson") || normalized.includes("chair")) {
    if (normalized.includes("vice")) {
      return includesChapter ? "chapter-vice-chair" : "vice-chairperson";
    }
    return includesChapter ? "chapter-chair" : "chairperson";
  }
  if (normalized.includes("vice chair")) {
    return includesChapter ? "chapter-vice-chair" : "vice-chairperson";
  }
  if (normalized.includes("general secretary") && normalized.includes("joint")) {
    return includesChapter ? "chapter-joint-secretary" : "joint-general-secretary";
  }
  if (normalized.includes("general secretary") || normalized.includes("secretary")) {
    return includesChapter ? "chapter-secretary" : "general-secretary";
  }
  if (normalized.includes("treasurer")) {
    return includesChapter ? "chapter-treasurer" : "treasurer";
  }
  if (normalized.includes("web") && normalized.includes("master")) {
    return includesChapter ? "chapter-webmaster" : "webmaster";
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
