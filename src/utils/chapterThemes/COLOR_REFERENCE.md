# IEEE BUBT SB Chapter & Affinity Group Color Reference

## Quick Color Reference

This is a quick visual reference for all chapter and affinity group colors used in the IEEE BUBT SB website.

### Chapters

#### 🔵 IEEE Computer Society
- **Slug**: `ieee-computer-society-student-branch-chapter`
- **Color**: `#38bdf8` (Sky Blue)
- **Usage**: Technology, digital innovation, computing

#### 🟠 IEEE Robotics & Automation Society
- **Slug**: `ieee-robotics-and-automation-society-student-branch-chapter`
- **Color**: `#fb923c` (Orange)
- **Usage**: Automation, robotics, dynamic systems

#### 🟣 IEEE Photonics Society
- **Slug**: `ieee-photonics-society-student-branch-chapter`
- **Color**: `#e879f9` (Fuchsia)
- **Usage**: Light, optics, photonics

#### 🟢 IEEE Power & Energy Society
- **Slug**: `ieee-power-and-energy-society-student-branch-chapter`
- **Color**: `#86efac` (Green)
- **Usage**: Sustainable energy, power systems

#### 🔷 IEEE Systems Council
- **Slug**: `ieee-systems-council-student-branch-chapter`
- **Color**: `#2dd4bf` (Teal)
- **Usage**: Systems thinking, integration

#### 🌸 IEEE Power Electronics Society
- **Slug**: `ieee-power-electronics-society-student-branch-chapter`
- **Color**: `#fda4af` (Rose Pink)
- **Usage**: Electronic circuits, power electronics

### Affinity Groups

#### 💜 IEEE BUBT Women in Engineering
- **Slug**: `ieee-bubt-women-in-engineering-student-branch-affinity-group`
- **Color**: `#c084fc` (Purple)
- **Usage**: Diversity, empowerment, inclusivity

### Default Theme
- **Color**: `#93c5fd` (Light Blue)
- **Usage**: Fallback for chapters without specific themes

---

## Color Palette at a Glance

| Entity | Color Hex | RGB | Visual |
|--------|-----------|-----|--------|
| Computer Society | #38bdf8 | rgb(56, 189, 248) | 🔵 Sky Blue |
| Robotics & Automation | #fb923c | rgb(251, 146, 60) | 🟠 Orange |
| Photonics | #e879f9 | rgb(232, 121, 249) | 🟣 Fuchsia |
| Power & Energy | #86efac | rgb(134, 239, 172) | 🟢 Green |
| Systems Council | #2dd4bf | rgb(45, 212, 191) | 🔷 Teal |
| Power Electronics | #fda4af | rgb(253, 164, 175) | 🌸 Rose Pink |
| Women in Engineering | #c084fc | rgb(192, 132, 252) | 💜 Purple |
| Default | #93c5fd | rgb(147, 197, 253) | 🔵 Light Blue |

---

## Usage Examples

### In React Components

```typescript
import { getChapterTheme } from '@/utils/chapterThemes';

// Get theme for a specific chapter
const theme = getChapterTheme('ieee-computer-society-student-branch-chapter');

// Use theme properties
<div style={{ 
  background: theme.cardBackground,
  borderColor: theme.cardBorder,
  boxShadow: theme.cardShadow 
}}>
  <h2 style={{ color: theme.accentTextColor }}>Chapter Name</h2>
</div>
```

### Checking if a Theme Exists

```typescript
import { hasChapterTheme } from '@/utils/chapterThemes';

if (hasChapterTheme(chapterSlug)) {
  // Use custom theme
} else {
  // Use default theme
}
```

### Getting All Available Themes

```typescript
import { getAvailableChapterSlugs } from '@/utils/chapterThemes';

const slugs = getAvailableChapterSlugs();
// Returns array of all chapter slugs with defined themes
```

---

## Design Philosophy

### Color Selection Criteria

1. **Distinctiveness**: Each color is visually distinct from others
2. **Accessibility**: All colors provide good contrast on dark backgrounds (slate-950)
3. **Meaning**: Colors reflect the chapter's field or mission
4. **Consistency**: All colors work harmoniously within the overall design system

### Technical Implementation

- Colors are defined as hex values
- The `createTheme()` function generates 24+ derivative properties from a single accent color
- RGBA conversions with varying opacity create depth and hierarchy
- Gradients and shadows are automatically calculated for visual interest

### Best Practices

- Test colors on actual chapter pages before committing changes
- Ensure adequate contrast ratios for accessibility (WCAG AA minimum)
- Consider how colors appear on different devices and in different lighting
- Maintain the color-field association for intuitive recognition
