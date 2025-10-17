# Chapter and Affinity Group Color Themes

## Overview

The IEEE BUBT SB website uses a sophisticated color theming system to provide unique visual identities for each chapter and affinity group. Each entity has a carefully selected color that reflects its field, mission, and character.

## Current Color Assignments

| Chapter/Group | Color | Hex Code |
|---------------|-------|----------|
| IEEE Computer Society | 🔵 Sky Blue | `#38bdf8` |
| IEEE Robotics & Automation Society | 🟠 Orange | `#fb923c` |
| IEEE Photonics Society | 🟣 Fuchsia | `#e879f9` |
| IEEE Power & Energy Society | 🟢 Green | `#86efac` |
| IEEE Systems Council | 🔷 Teal | `#2dd4bf` |
| IEEE Power Electronics Society | 🌸 Rose Pink | `#fda4af` |
| IEEE BUBT Women in Engineering | 💜 Purple | `#c084fc` |

## Documentation

This implementation includes comprehensive documentation:

### For Developers
- **[README.md](src/utils/chapterThemes/README.md)** - Technical documentation of the theme system
- **[COLOR_REFERENCE.md](src/utils/chapterThemes/COLOR_REFERENCE.md)** - Quick reference guide with usage examples

### For Administrators
- **[ADMIN_GUIDE.md](src/utils/chapterThemes/ADMIN_GUIDE.md)** - Step-by-step guide for adding/modifying chapter colors

## Implementation Details

- **Location**: `src/utils/chapterThemes/index.ts`
- **Function**: `getChapterTheme(slug)` - Returns theme object for a chapter
- **Helper Functions**: 
  - `getAvailableChapterSlugs()` - Lists all chapters with themes
  - `hasChapterTheme(slug)` - Checks if a theme exists

## Where Colors Are Used

The chapter color themes are applied throughout the site:

1. **Chapters Index** (`/chapters`) - Themed cards with gradients, borders, and shadows
2. **Chapter Detail** (`/chapters/[slug]`) - Hero sections, panels, and content areas
3. **Leadership Page** (`/leadership`) - Chapter sections with colored panels
4. **Team Cards** - Potential future integration for chapter-specific styling

## Quick Start

### Using a Theme in Components

```typescript
import { getChapterTheme } from '@/utils/chapterThemes';

const theme = getChapterTheme(chapterSlug);

// Apply theme styles
<div style={{ 
  background: theme.cardBackground,
  borderColor: theme.cardBorder,
  boxShadow: theme.cardShadow 
}}>
  {/* Your content */}
</div>
```

### Adding a New Chapter

1. Choose an appropriate color (see ADMIN_GUIDE.md for criteria)
2. Add to `themes` object in `src/utils/chapterThemes/index.ts`
3. Update documentation files
4. Test on actual pages
5. Commit changes

## Design Philosophy

### Color Selection Principles

1. **Meaningful** - Colors reflect the chapter's field or mission
2. **Distinct** - Each color is visually unique
3. **Accessible** - Good contrast on dark backgrounds
4. **Harmonious** - Works within the overall design system

### Automatic Theme Generation

From a single accent color, the system automatically generates:
- Text colors at various opacities
- Background gradients
- Border colors
- Shadow effects with color tints
- Button and panel styles

This ensures visual consistency while maintaining unique chapter identities.

## Benefits

✅ **Consistency** - All chapters follow the same design pattern
✅ **Flexibility** - Easy to add new chapters or modify colors
✅ **Maintainability** - Single source of truth for all theme properties
✅ **Scalability** - Can support unlimited chapters
✅ **Performance** - Themes generated at build time, no runtime overhead

## Contributing

When adding or modifying chapter colors:

1. Follow the color selection guidelines in ADMIN_GUIDE.md
2. Update all relevant documentation
3. Test on all affected pages
4. Ensure lint and build pass
5. Submit changes with descriptive commit messages

## Future Enhancements

Potential improvements to consider:

- [ ] Color theme preview tool in admin dashboard
- [ ] Dark/light mode variants
- [ ] Additional theme properties for specific use cases
- [ ] Color accessibility checker integration
- [ ] Theme export for use in other IEEE BUBT SB materials

## Questions or Issues?

For questions about:
- **Using themes in code** - See README.md
- **Color meanings** - See COLOR_REFERENCE.md  
- **Adding/modifying colors** - See ADMIN_GUIDE.md
- **Technical implementation** - Review `src/utils/chapterThemes/index.ts`

---

**Last Updated**: 2025-10-16  
**Maintained By**: IEEE BUBT SB Web Development Team
