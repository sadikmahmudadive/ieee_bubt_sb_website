# Administrator Guide: Adding Chapter Colors

This guide explains how to add or modify color themes for chapters and affinity groups in the IEEE BUBT SB website.

## Prerequisites

- Basic understanding of hex color codes
- Access to the repository source code
- Text editor or IDE for editing TypeScript files

## Step-by-Step: Adding a New Chapter Color Theme

### 1. Choose an Appropriate Color

Consider the following when selecting a color:

- **Field Relevance**: Does the color relate to the chapter's discipline?
  - Technology/Computing: Blues, cyans
  - Energy/Power: Greens, yellows  
  - Robotics/Mechanics: Oranges, reds
  - Diversity/Social: Purples, magentas
  - General/Systems: Teals, aquas

- **Distinctiveness**: Is it different enough from existing colors?
- **Visibility**: Does it stand out on dark backgrounds (slate-950)?
- **Accessibility**: Does it provide adequate contrast?

### 2. Determine the Chapter Slug

The slug is the URL-friendly identifier for the chapter. It should:
- Use lowercase letters only
- Use hyphens instead of spaces
- Follow the pattern: `ieee-[society-name]-student-branch-chapter`
- For affinity groups: `ieee-bubt-[group-name]-student-branch-affinity-group`

**Examples:**
```
ieee-computer-society-student-branch-chapter
ieee-robotics-and-automation-society-student-branch-chapter
ieee-bubt-women-in-engineering-student-branch-affinity-group
```

### 3. Add the Theme Definition

Open the file: `src/utils/chapterThemes/index.ts`

Find the `themes` object (around line 92) and add your new entry:

```typescript
const themes: ThemeMap = {
  "ieee-computer-society-student-branch-chapter": createTheme("#38bdf8"),
  "ieee-robotics-and-automation-society-student-branch-chapter": createTheme("#fb923c"),
  // ... other themes ...
  
  // Add your new theme here:
  "your-chapter-slug-here": createTheme("#YOUR_HEX_COLOR"),
};
```

### 4. Update Documentation

#### Update the inline comment
In the same file, update the comment above the `themes` object to include your new chapter:

```typescript
/**
 * Color themes for IEEE BUBT SB chapters and affinity groups
 * 
 * Each chapter/affinity group has a unique color scheme that reflects its identity:
 * - Computer Society: Sky Blue (#38bdf8) - Represents technology and digital innovation
 * // ... other entries ...
 * - Your New Chapter: Color Name (#hexcode) - Brief description
 */
```

#### Update README.md
Open `src/utils/chapterThemes/README.md` and add a row to the color assignments table:

```markdown
| Your Chapter Name | `your-chapter-slug` | `#hexcode` | Color Name | Rationale/description |
```

#### Update COLOR_REFERENCE.md
Open `src/utils/chapterThemes/COLOR_REFERENCE.md` and add entries to both sections:

1. In "Quick Color Reference":
```markdown
#### 🔵 Your Chapter Name
- **Slug**: `your-chapter-slug`
- **Color**: `#hexcode` (Color Name)
- **Usage**: Brief description
```

2. In the "Color Palette at a Glance" table:
```markdown
| Your Chapter | #hexcode | rgb(r, g, b) | 🔵 Color Name |
```

### 5. Test Your Changes

1. **Lint the code:**
   ```bash
   npm run lint
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **View the chapter pages:**
   - Navigate to `/chapters` to see the chapter listing
   - Navigate to `/chapters/your-chapter-slug` to see the chapter detail page
   - Navigate to `/leadership` to see the chapter in the leadership view

4. **Verify the color appears correctly:**
   - Check card backgrounds
   - Check borders and shadows
   - Check button colors
   - Check hero gradients (on detail page)
   - Ensure text is readable

### 6. Commit Your Changes

```bash
git add src/utils/chapterThemes/
git commit -m "Add color theme for [Chapter Name]"
git push
```

## Modifying an Existing Chapter Color

To change a chapter's color:

1. Find the chapter entry in `src/utils/chapterThemes/index.ts`
2. Change the hex color in `createTheme("#OLDCOLOR")` to `createTheme("#NEWCOLOR")`
3. Update all documentation files with the new color
4. Test and commit as described above

## Color Testing Checklist

Before finalizing a color choice, verify:

- [ ] Color displays correctly on dark backgrounds
- [ ] Text is readable against colored backgrounds
- [ ] Color is distinct from all other chapter colors
- [ ] Borders and shadows are visible
- [ ] Gradient transitions look smooth
- [ ] Color works well in both light and dark areas
- [ ] Buttons are clearly visible
- [ ] Hero sections look appealing
- [ ] Mobile and desktop views both look good

## Troubleshooting

### Color looks washed out
- Choose a more saturated color
- Increase the hex values for the RGB components

### Color is too bright/harsh
- Reduce saturation slightly
- Choose a darker shade of the same hue

### Text is hard to read
- The automatic text color generation should handle this
- If issues persist, the problem is likely the base color choice

### Theme not appearing
- Check that the slug exactly matches what's in the database
- Slugs are case-sensitive and must match exactly
- Check for typos in the slug

### Build errors after adding theme
- Run `npm run lint` to check for syntax errors
- Ensure you added a comma after the previous theme entry
- Verify the hex color format is correct (#RRGGBB)

## Advanced: Understanding Theme Generation

The `createTheme()` function automatically generates 24 properties from your single accent color:

- **Opacity variations**: Creates softer versions at 12%, 20%, 50%, 85%, 92% opacity
- **Gradients**: Generates linear gradients for backgrounds and overlays
- **Shadows**: Creates color-tinted shadows for depth
- **Borders**: Semi-transparent borders that glow with the accent color

You don't need to define these manually - just provide the main hex color!

## Examples of Good Color Choices

✅ **Good:**
- `#38bdf8` - Bright sky blue, stands out, good contrast
- `#fb923c` - Vibrant orange, energetic, visible
- `#86efac` - Fresh green, clear, distinct

❌ **Poor:**
- `#1a1a2e` - Too dark, blends with background
- `#f0f0f0` - Too light, no contrast on dark background
- `#808080` - Too muted, lacks visual impact

## Need Help?

If you're unsure about color choices or need assistance:

1. Use online color picker tools (e.g., coolors.co, color.adobe.com)
2. Check IEEE official colors for the chapter's parent organization
3. Look at similar organizations' websites for inspiration
4. Test colors on the actual pages before committing

## Additional Resources

- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Coolors Color Palette Generator](https://coolors.co)
- [Adobe Color Wheel](https://color.adobe.com)
- [Hex to RGB Converter](https://www.rgbtohex.net)
