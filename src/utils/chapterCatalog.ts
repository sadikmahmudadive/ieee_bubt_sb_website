export type ChapterCatalogEntry = {
  name: string;
  slug: string;
  shortName: string;
  logo: string;
  logoAlt: string;
  kind: "chapter" | "affinity-group";
};

export const chapterCatalog: ChapterCatalogEntry[] = [
  {
    name: "IEEE Computer Society Student Branch Chapter",
    slug: "ieee-computer-society-student-branch-chapter",
    shortName: "Computer Society",
    logo: "/brand/logo%20CS.png",
    logoAlt: "IEEE Computer Society BUBT SBC",
    kind: "chapter"
  },
  {
    name: "IEEE Systems Council Student Branch Chapter",
    slug: "ieee-systems-council-student-branch-chapter",
    shortName: "Systems Council",
    logo: "/brand/logo%20SC.png",
    logoAlt: "IEEE Systems Council BUBT SBC",
    kind: "chapter"
  },
  {
    name: "IEEE Robotics and Automation Society Student Branch Chapter",
    slug: "ieee-robotics-and-automation-society-student-branch-chapter",
    shortName: "Robotics & Automation",
    logo: "/brand/logo%20RAS.png",
    logoAlt: "IEEE Robotics and Automation Society BUBT SBC",
    kind: "chapter"
  },
  {
    name: "IEEE Power and Energy Society Student Branch Chapter",
    slug: "ieee-power-and-energy-society-student-branch-chapter",
    shortName: "Power & Energy",
    logo: "/brand/logo%20PES.png",
    logoAlt: "IEEE Power and Energy Society BUBT SBC",
    kind: "chapter"
  },
  {
    name: "IEEE Photonics Society Student Branch Chapter",
    slug: "ieee-photonics-society-student-branch-chapter",
    shortName: "Photonics Society",
    logo: "/brand/logo%20PS.png",
    logoAlt: "IEEE Photonics Society BUBT SBC",
    kind: "chapter"
  },
  {
    name: "IEEE Power Electronics Society Student Branch Chapter",
    slug: "ieee-power-electronics-society-student-branch-chapter",
    shortName: "Power Electronics",
    logo: "/brand/logo%20PELS.png",
    logoAlt: "IEEE Power Electronics Society BUBT SBC",
    kind: "chapter"
  },
  {
    name: "IEEE BUBT Women in Engineering Student Branch Affinity Group",
    slug: "ieee-bubt-women-in-engineering-student-branch-affinity-group",
    shortName: "Women in Engineering",
    logo: "/brand/logo%20WIE.png",
    logoAlt: "IEEE BUBT Women in Engineering SB Affinity Group",
    kind: "affinity-group"
  }
];
