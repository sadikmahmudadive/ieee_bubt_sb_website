# Chapter and Affinity Group Color Themes

This directory contains the color theme system for IEEE BUBT SB chapters and affinity groups. Each chapter/affinity group has a unique color scheme that provides visual identity and helps distinguish them throughout the website.

## Current Color Assignments

| Chapter/Affinity Group | Slug | Color Code | Color Name | Rationale |
|------------------------|------|------------|------------|-----------|
| IEEE Computer Society | `ieee-computer-society-student-branch-chapter` | `#38bdf8` | Sky Blue | Represents technology, digital innovation, and computing |
| IEEE Robotics & Automation Society | `ieee-robotics-and-automation-society-student-branch-chapter` | `#fb923c` | Orange | Dynamic and energetic, reflects automation and movement |
| IEEE Photonics Society | `ieee-photonics-society-student-branch-chapter` | `#e879f9` | Fuchsia | Light and optics theme with vibrant magenta/pink |
| IEEE Power & Energy Society | `ieee-power-and-energy-society-student-branch-chapter` | `#86efac` | Green | Sustainable energy, environmental focus, and renewable power |
| IEEE Systems Council | `ieee-systems-council-student-branch-chapter` | `#2dd4bf` | Teal | Systems thinking, interconnected processes, and integration |
| IEEE Power Electronics Society | `ieee-power-electronics-society-student-branch-chapter` | `#fda4af` | Rose Pink | Electronic circuits with a softer, approachable technology feel |
| IEEE BUBT Women in Engineering | `ieee-bubt-women-in-engineering-student-branch-affinity-group` | `#c084fc` | Purple | Empowerment, diversity, and inclusivity |

## Theme Properties

Each color theme generates the following properties automatically using the `createTheme()` function:

- **accent**: Primary accent color for the chapter
- **accentTextColor**: Text color using the accent (92% opacity)
- **secondaryTextColor**: Secondary text in slate gray
- **metaColor**: Metadata and subtle information
- **heroGradient**: Background gradient for hero sections
- **heroOverlay**: Overlay gradient for hero images
- **heroMetaColor**: Text color for hero metadata
- **accentGradient**: Accent gradient for buttons and highlights
- **accentButtonText**: Button text color on accent backgrounds
- **cardBackground**: Background for chapter cards with gradient
- **cardBorder**: Border color for cards
- **cardShadow**: Box shadow for cards with accent tint
- **pillBackground**: Background for role/name pills
- **pillBorder**: Border for pills
- **buttonBorder**: Border for buttons
- **buttonBackground**: Background for buttons
- **buttonTextColor**: Text color for buttons
- **panelBackground**: Background for larger panels/sections
- **panelBorder**: Border for panels
- **panelShadow**: Box shadow for panels
- **navText**: Navigation text color
- **navSelectedBackground**: Background for selected nav items
- **navSelectedText**: Text color for selected nav items

## Adding a New Chapter or Affinity Group

To add a new chapter or affinity group color theme:

1. Choose an appropriate color that:
   - Hasn't been used by existing chapters
   - Reflects the chapter's identity and field
   - Provides good contrast on dark backgrounds
   - Works well with the overall site design

2. Add the new entry to the `themes` object in `index.ts`:
   ```typescript
   "chapter-slug-name": createTheme("#hexcolor")
   ```

3. Update this README with the new chapter information

## Color Selection Guidelines

When selecting colors for new chapters:

- **Use vibrant, saturated colors** that stand out on dark backgrounds
- **Avoid very light colors** (they won't have enough contrast)
- **Avoid very dark colors** (they'll blend with the background)
- **Consider the chapter's field**: 
  - Tech/Computing: Blues, cyans
  - Energy/Power: Greens, yellows
  - Robotics/Automation: Oranges, reds
  - Diversity/Inclusion: Purples, magentas
  - General/Multidisciplinary: Teals, aquas
- **Test colors** on actual chapter pages before committing

## Used in Pages

The chapter themes are applied in:

- `/chapters` - Chapter listing page with themed cards
- `/chapters/[slug]` - Individual chapter detail pages with themed hero and panels
- `/leadership` - Leadership page with themed chapter sections
- `TeamMemberCard` component (when extended for chapter-specific styling)

## Technical Notes

- The `toRgba()` helper converts hex colors to RGBA format with opacity control
- The `createTheme()` function generates a complete theme object from a single accent color
- Themes are accessed via `getChapterTheme(slug)` which returns the default theme if slug not found
- The default theme uses `#93c5fd` (light blue) for chapters without specific themes
