# Design System Inspired by IEEE

## 1. Visual Theme & Atmosphere

The IEEE design system embodies cutting-edge innovation and technological sophistication through a bold fusion of deep navy tones with vibrant cyan and magenta accents. The visual identity conveys trust and forward-thinking progress, drawing from the organization's mission to advance technology for humanity. The system balances professional authority with modern dynamism, using high-contrast color interactions and clean typography to create a sense of clarity and vision. Layered depth effects and geometric patterns reinforce the technology sector positioning while maintaining accessibility and legibility across all touchpoints.

**Key Characteristics**
- Deep navy and black foundation with electric cyan and magenta accents
- High contrast for accessibility and visual hierarchy
- Clean, modern sans-serif typography with generous whitespace
- Professional yet innovative aesthetic
- Technology-forward color blocking and gradients
- Strong typography-driven hierarchy
- Minimal ornamentation with purposeful geometric elements

## 2. Color Palette & Roles

### Primary
- **IEEE Blue** (`#00629B`): Primary brand color used for links, buttons, and key interactive elements; establishes brand recognition and primary call-to-action focus
- **Blue Variant** (`#147AAD`): Secondary primary shade for depth variation and hover states; slightly lighter for visual hierarchy
- **Deep Navy** (`#180D43`): Darkest primary tone for backgrounds and high-contrast overlays; conveys authority and stability

### Accent Colors
- **Cyan Bright** (`#00AEEF`): Vibrant secondary accent for highlights and accent borders; represents innovation and digital forward-thinking
- **Cyan Medium** (`#00B5E2`): Slightly muted cyan for alternate accent uses and transitions; maintains vibrancy while supporting hierarchy
- **Magenta Warning** (`#FFC72A`): Warning and alert state color; draws attention without aggressive contrast; used for important notifications

### Interactive
- **Electric Blue** (`#0000EE`): High-emphasis interactive color for maximum visibility; links and active states
- **Orange Accent** (`#ED7522`): Secondary accent for interactive emphasis; creates color variation in CTAs
- **Teal Primary** (`#006699`): Alternative blue for certain interactive contexts and component variants

### Neutral Scale
- **Black** (`#000000`): Primary text, borders, and dark UI elements; highest contrast for readability
- **White** (`#FFFFFF`): Primary background and text on dark surfaces; neutral light reference
- **Light Gray** (`#EBEBEB`): Subtle background surfaces and light borders; minimal contrast for secondary content areas
- **Gray Medium** (`#E6E7E7`): Divider lines and secondary borders; subtle visual separation
- **Gray Dark** (`#D2D3D3`): Slightly darker dividers and disabled states
- **Gray Deep** (`#BFBFBF`): Deeper neutral for muted interactive elements
- **Gray Muted** (`#A3A3A3`): Disabled text and secondary metadata
- **Gray Shade** (`#A6A7A7`): Alternative muted neutral for consistent gray system

### Surface & Borders
- **White Surface** (`#FFFFFF`): Card backgrounds, modal panels, and primary content containers
- **Light Surface** (`#EBEBEB`): Secondary surface backgrounds and subtle section dividers
- **Border Gray** (`#E6E7E7`): Default border color for most components

## 3. Typography Rules

### Font Family
**Primary: Open Sans** (sans-serif fallback: Arial, Helvetica, system-ui)
- Used for headings, body text, and primary content hierarchy

**Secondary: Arial** (sans-serif fallback: Helvetica, system-ui)
- Used for buttons, form labels, and compact text

**Tertiary: Helvetica** (sans-serif fallback: Arial, system-ui)
- Decorative spans and inline accent text

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | Open Sans | 50px | 300 | 60px | 0px | Hero headings and page titles; commanding presence |
| Heading / H2 | Open Sans | 38px | 300 | 48px | 0px | Section headings and major content divisions |
| Subheading / H3 | Open Sans | 14px | 800 | 16px | 0px | Small headings, labels, and emphasis text |
| Body Text | Open Sans | 15px | 400 | 18.75px | 0px | Primary paragraph and content text |
| Body Large | Helvetica | 16px | 400 | 16px | 0px | Decorative text and inline content spans |
| Button Text | Arial | 13.33px | 400 | normal | 0px | Button labels and interactive text; compact and clear |
| Caption | Open Sans | 14px | 400 | 16px | 0px | Fine print, metadata, and secondary information |

### Principles
- **Weight economy**: Use light (300) for display, regular (400) for body, bold (700) for buttons and emphasis
- **Line height discipline**: Maintain 1.2x to 1.25x multiplier for readability and visual breathing room
- **Hierarchy through scale**: Typography size creates primary visual hierarchy; color supports secondary emphasis
- **Sans-serif consistency**: All primary font families are sans-serif for modern, clean appearance
- **Accessibility focus**: Generous line heights and high contrast text colors ensure legibility across all contexts

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#00629B`
- Text Color: `#FFFFFF`
- Font: Arial, 15px, weight 700
- Padding: `11px 12px 11px 12px`
- Border Radius: `25px`
- Border: `1px solid #00629B`
- Height: `39px`
- Line Height: `15px`
- Hover State: Background `#147AAD`, border `1px solid #147AAD`
- Active State: Background `#180D43`, border `1px solid #180D43`
- Disabled State: Background `#BFBFBF`, text `#A3A3A3`, border `1px solid #BFBFBF`

**Secondary Button**
- Background: `#FFFFFF`
- Text Color: `#00629B`
- Font: Arial, 13.33px, weight 400
- Padding: `0px 0px 0px 0px`
- Border Radius: `50%`
- Border: `2px solid #FFFFFF`
- Height: `20px`
- Width: `20px`
- Line Height: `normal`
- Hover State: Background `#EBEBEB`, text `#00629B`
- Focus State: Border `2px solid #00629B`

**Ghost Button (Text-Only)**
- Background: `transparent`
- Text Color: `#000000`
- Font: Arial, 13.33px, weight 400
- Padding: `0px 0px 0px 0px`
- Border: `0px none`
- Border Radius: `0px`
- Height: `40px`
- Width: `40px`
- Line Height: `normal`
- Hover State: Text Color `#00629B`
- Underline on hover: `1px solid #00629B`

### Links

**Default Link**
- Background: `transparent`
- Text Color: `#00629B`
- Font: Open Sans, 15px, weight 400
- Padding: `0px 0px 0px 0px`
- Border: `0px none`
- Border Radius: `0px`
- Line Height: `18.75px`
- Hover State: Text Color `#147AAD`, underline `1px solid #147AAD`
- Visited State: Text Color `#0000EE`
- Focus State: Outline `2px solid #00B5E2`

**Light Link (on dark background)**
- Background: `#FFFFFF`
- Text Color: `#000000`
- Font: Open Sans, 16px, weight 400
- Padding: `0px 0px 0px 0px`
- Border: `0px none`
- Line Height: `24px`
- Hover State: Text Color `#00629B`, background `#EBEBEB`

### Cards & Containers

**Card Default**
- Background: `transparent`
- Text Color: `#FFFFFF`
- Font: Open Sans, 16px, weight 400
- Padding: `0px 0px 0px 0px`
- Border: `0px none`
- Border Radius: `0px`
- Line Height: `24px`
- Box Shadow: `none`
- Hover State: Box Shadow `rgb(204, 204, 204) 0px 0px 2px 2px`

**Card with Border**
- Background: `#FFFFFF`
- Text Color: `#000000`
- Font: Open Sans, 16px, weight 400
- Padding: `24px 24px 24px 24px`
- Border: `1px solid #E6E7E7`
- Border Radius: `5px`
- Line Height: `24px`
- Hover State: Border `1px solid #00B5E2`, box shadow `rgb(204, 204, 204) 0px 0px 4px 2px`

**Container Section**
- Background: `#FFFFFF` or `#EBEBEB`
- Padding: `40px 24px 40px 24px`
- Border: `0px none`
- Border Radius: `0px`

### Inputs & Forms

**Text Input**
- Background: `#FFFFFF`
- Text Color: `#000000`
- Font: Open Sans, 16px, weight 400
- Padding: `1px 2px 1px 25px`
- Border: `1px solid #00B5E2`
- Border Radius: `0px`
- Height: `73px` (or 40px for standard)
- Line Height: `26px`
- Focus State: Border `1px solid #00629B`, box shadow `0px 0px 0px 3px rgba(0, 98, 155, 0.1)`
- Placeholder Text Color: `#A3A3A3`
- Disabled State: Background `#EBEBEB`, border `1px solid #D2D3D3`, text `#BFBFBF`

**Form Label**
- Font: Arial, 13.33px, weight 700
- Text Color: `#000000`
- Line Height: `16px`
- Margin Bottom: `8px`
- Required Indicator: Text Color `#ED7522`

### Navigation

**Navigation Bar**
- Background: `transparent` (overlaid on content with 80% opacity dark background)
- Text Color: `#000000` or `#FFFFFF` depending on context
- Font: Open Sans, 16px, weight 400
- Padding: `16px 24px 16px 24px`
- Line Height: `24px`
- Border: `0px none`
- Height: auto, minimum `64px`

**Navigation Link (Active)**
- Text Color: `#00629B`
- Border Bottom: `2px solid #00629B`
- Padding Bottom: `4px`

**Navigation Link (Hover)**
- Text Color: `#147AAD`
- Border Bottom: `2px solid #147AAD`
- Transition: `0.2s ease`

### Badges

**Badge Primary**
- Background: `#00629B`
- Text Color: `#FFFFFF`
- Font: Arial, 12px, weight 700
- Padding: `4px 8px 4px 8px`
- Border Radius: `12px`
- Line Height: `16px`

**Badge Warning**
- Background: `#FFC72A`
- Text Color: `#000000`
- Font: Arial, 12px, weight 700
- Padding: `4px 8px 4px 8px`
- Border Radius: `12px`
- Line Height: `16px`

## 5. Layout Principles

### Spacing System
**Base Unit**: `4px`

**Scale**:
- `4px` (micro-spacing between elements)
- `8px` (compact spacing)
- `12px` (small spacing)
- `16px` (standard padding/margin)
- `20px` (medium spacing)
- `24px` (comfortable spacing)
- `28px` (section margin)
- `32px` (generous spacing)
- `40px` (large section spacing)
- `44px` (XL spacing)
- `52px` (XXL spacing)
- `60px` (hero section spacing)

**Usage Context**:
- Button internal padding: `11px 12px`
- Card padding: `24px`
- Section padding: `40px 24px`
- Component gap: `16px` to `24px`
- Text margin bottom: `16px`

### Grid & Container
**Max Width**: `1200px` for main content containers; `100%` for full-bleed sections

**Column Strategy**: 
- Desktop: 12-column grid with `24px` gutters
- Tablet: 8-column grid with `16px` gutters
- Mobile: Single-column layout with `16px` side padding

**Section Patterns**:
- Hero sections: Full bleed with `60px` vertical padding
- Content sections: Max-width container with `40px` vertical padding
- Cards grid: 3-column desktop, 2-column tablet, 1-column mobile
- Navigation: Fixed or sticky header with `16px` horizontal padding

### Whitespace Philosophy
Generous whitespace creates breathing room and emphasizes content hierarchy. Sections are visually separated by substantial vertical space (`40px` to `60px`) rather than heavy borders. Horizontal margins provide comfortable reading width for body text (ideal measure around 65-75 characters). Empty space is a design element—avoid cramped layouts. Use consistent spacing relationships to create visual rhythm.

### Border Radius Scale
- **Sharp** (`0px`): Navigation bars, inputs, major containers
- **Subtle** (`5px`): Card borders, form elements, small containers
- **Rounded** (`12px`): Badges and small UI elements
- **Pill** (`25px`): Button primary and secondary shapes
- **Full** (`50%`): Circular button icons and avatar containers

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base (0) | No shadow | Body backgrounds, containers |
| Raised (1) | `0px 2px 4px rgba(0, 0, 0, 0.08)` | Default cards and panels |
| Elevated (2) | `rgb(204, 204, 204) 0px 0px 2px 2px` | Hovered cards, modals |
| Float (3) | `0px 8px 16px rgba(0, 0, 0, 0.12)` | Dropdowns, tooltips |
| Modal (4) | `0px 12px 24px rgba(0, 0, 0, 0.15)` | Dialog overlays, popups |

**Shadow Philosophy**:
Shadows are used sparingly to create subtle depth and focus without overwhelming the design. Primary shadow system uses `rgb(204, 204, 204)` as a neutral mid-gray that works well against both light and dark backgrounds. Shadows scale from invisible at the base level to pronounced at modal level. Hover states introduce shadows to indicate interactivity and state change. The system avoids harsh black shadows in favor of nuanced grays and semi-transparent darks, maintaining the professional and modern aesthetic.

## 7. Do's and Don'ts

### Do
- **Do use IEEE Blue** (`#00629B`) as the primary interactive color for all primary CTAs and links
- **Do maintain high contrast** between text and background; minimum 4.5:1 ratio for WCAG AA compliance
- **Do apply consistent button padding** of `11px 12px` on primary buttons for uniform height of `39px`
- **Do use Open Sans** for all body text and headings; fallback to Arial or Helvetica as specified
- **Do space sections vertically** with at least `40px` padding; larger spacing (`60px`) for hero sections
- **Do apply `25px` border radius** to all primary action buttons for the signature pill shape
- **Do use cyan accents** (`#00AEEF`, `#00B5E2`) to highlight innovation and secondary interactive states
- **Do implement subtle shadows** via `rgb(204, 204, 204)` on hover to indicate interactivity
- **Do group related elements** with `16px` spacing; use larger gaps (`24px` to `32px`) between sections
- **Do use the weight hierarchy** of 300 for display, 400 for body, 700 for emphasis

### Don't
- **Don't use pure black text** on colored backgrounds other than white; use high-contrast alternatives
- **Don't apply aggressive shadows** or multiple layered shadows; keep the design clean and minimal
- **Don't mix serif and sans-serif fonts** in the same context; maintain typeface consistency per role
- **Don't create button widths less than `225px`** for primary actions unless space-constrained; maintain touch-target size
- **Don't reduce button padding** below `11px` vertical or `12px` horizontal; preserve clickability
- **Don't use the orange accent** (`#ED7522`) as primary brand color; reserve for warnings and secondary emphasis
- **Don't apply border radius** greater than `25px` except for perfect circles (`50%`)
- **Don't create inputs with borders** other than `1px solid #00B5E2`; maintain consistency
- **Don't exceed line-height multipliers** of 1.5x for body text; keep typography tight and professional
- **Don't hide focus states** on interactive elements; always provide visible `:focus` styling with `#00B5E2` outline

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 480px | Single column layout, stacked cards, full-width inputs, `16px` padding, font size -2px |
| Tablet | 480px – 768px | 2-column grid, `16px` gutters, adjusted padding to `24px`, heading sizes reduced |
| Laptop | 768px – 1200px | 3-column grid, `24px` gutters, full spacing, all standard sizes |
| Desktop | ≥ 1200px | 3-4 column grid, centered max-width container, standard sizes, expanded whitespace |

### Touch Targets
- **Minimum height**: `44px` for all interactive elements (buttons, links in lists, inputs)
- **Minimum width**: `44px` for icon buttons and small controls
- **Finger-friendly spacing**: At least `8px` padding around clickable areas to prevent mis-taps
- **Link padding**: Add `4px` vertical padding to inline links on touch devices
- **Form inputs**: Minimum `44px` height on mobile; `40px` acceptable on desktop

### Collapsing Strategy
- **Navigation**: Collapses from horizontal to hamburger menu icon below `768px` width
- **Grid cards**: Reduce from 3 columns to 2 at `768px`, then to 1 column below `480px`
- **Padding**: Reduce section padding from `40px` to `24px` below `768px`, to `16px` below `480px`
- **Typography**: Reduce heading sizes by 20% on tablet (`38px` → `32px`), 30% on mobile (`38px` → `28px`)
- **Hero sections**: Reduce vertical padding from `60px` to `40px` on tablet, `24px` on mobile
- **Images & media**: Stack vertically on mobile; side-by-side above `768px`
- **Button widths**: Allow buttons to fill container width on mobile; fixed width on desktop
- **Margin between sections**: Reduce from `60px` to `40px` on tablet, `24px` on mobile

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: IEEE Blue (`#00629B`) for buttons, links, and interactive elements
- **Secondary CTA**: IEEE Blue Medium (`#147AAD`) for hover and depth states
- **Accent Highlight**: Cyan Bright (`#00AEEF`) for secondary accent and innovation markers
- **Text Primary**: Black (`#000000`) for all body text and headings
- **Text Light**: White (`#FFFFFF`) for text on dark backgrounds
- **Border Default**: Gray Medium (`#E6E7E7`) for card and input borders
- **Background Primary**: White (`#FFFFFF`) for card and container backgrounds
- **Background Secondary**: Light Gray (`#EBEBEB`) for section backgrounds and subtle contrast
- **Warning/Alert**: Warning Yellow (`#FFC72A`) for notification states
- **Disabled State**: Gray Deep (`#BFBFBF`) for inactive elements

### Iteration Guide
1. **Always use `#00629B` for primary buttons, links, and interactive states**; this is the brand anchor
2. **Apply `25px` border radius to all primary action buttons**; maintain the signature pill aesthetic
3. **Set button padding to `11px 12px 11px 12px`** for consistent `39px` height across all primary buttons
4. **Use Open Sans font family** for all headings and body text; fall back to Arial for buttons and Helvetica for inline text
5. **Maintain heading weights at 300 (display/H2) and 800 (H3)**; body text is always 400
6. **Apply generous vertical spacing**: `60px` for hero sections, `40px` for standard sections, `24px` minimum between content blocks
7. **Use subtle shadows only on hover states**: `rgb(204, 204, 204) 0px 0px 2px 2px` to indicate interactivity without visual clutter
8. **Apply high-contrast text**: minimum 4.5:1 ratio; use `#000000` on light backgrounds, `#FFFFFF` on dark
9. **Implement cyan accents** (`#00AEEF` or `#00B5E2`) for secondary interactive states and highlights
10. **Ensure mobile responsiveness**: Single-column layout below `480px`, stacked components, `16px` padding, `44px` touch targets