# Migrating from SCSS to Tailwind CSS

This guide outlines the process for transitioning your Vue.js project from SCSS to Tailwind CSS while preserving the existing design.

## Installation Steps

1. Install Tailwind CSS and its dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Replace your existing `main.scss` import in `main.ts` with the new CSS file:

```typescript
// src/main.ts
import './assets/styles/main.css' // Instead of main.scss
```

## Configuration Files

1. Use the provided `tailwind.config.js` that includes all your current design variables:
   - Colors from variables.scss
   - Spacing and sizing from variables.scss
   - Font sizes from variables.scss
   - Breakpoints from variables.scss
   - Shadows from variables.scss
   - Transitions from variables.scss

2. Set up your base CSS file with Tailwind directives and a few custom utilities:
   - The main CSS file contains your most commonly used utilities from mixins.scss
   - It preserves global styles that are essential but would be verbose in Tailwind

## SCSS to Tailwind Conversion Reference

### Color Classes

| SCSS                           | Tailwind                        |
|--------------------------------|---------------------------------|
| `color: $primary-color;`       | `class="text-primary"`          |
| `background-color: $bg-light;` | `class="bg-bg-light"`           |
| `border-color: $danger-color;` | `class="border-danger"`         |

### Typography

| SCSS                       | Tailwind                      |
|----------------------------|-------------------------------|
| `font-size: $font-size-lg;`| `class="text-lg"`            |
| `font-weight: bold;`       | `class="font-bold"`          |
| `line-height: 1.5;`        | `class="leading-normal"`     |
| `text-align: center;`      | `class="text-center"`        |

### Spacing

| SCSS                     | Tailwind                    |
|--------------------------|------------------------------|
| `margin: $spacing-md;`   | `class="m-md"`              |
| `padding: $spacing-lg;`  | `class="p-lg"`              |
| `margin-bottom: 1.5rem;` | `class="mb-6"`              |

### Layout

| SCSS Mixin                     | Tailwind                                    |
|--------------------------------|---------------------------------------------|
| `@include flex-center;`        | `class="flex items-center justify-center"`  |
| `@include flex-between;`       | `class="flex items-center justify-between"` |
| `@include flex-column;`        | `class="flex flex-col"`                     |

### Responsive Design

| SCSS                                              | Tailwind                                   |
|---------------------------------------------------|---------------------------------------------|
| `@include respond-to(md) { width: 50%; }`         | `class="w-full md:w-1/2"`                   |
| `@include respond-to(lg) { display: flex; }`      | `class="block lg:flex"`                     |

### Effects

| SCSS                              | Tailwind                                       |
|-----------------------------------|------------------------------------------------|
| `@include box-shadow(1);`         | `class="shadow-sm"`                            |
| `@include box-shadow(2);`         | `class="shadow-md"`                            |
| `@include box-shadow(3);`         | `class="shadow-lg"`                            |
| `@include transition(all, 0.3s);` | `class="transition-all duration-normal"`       |

### Text Utilities

| SCSS                         | Tailwind                      |
|------------------------------|-------------------------------|
| `@include text-truncate;`    | `class="text-truncate"`       |

## Component Migration Strategy

1. **Start with simple components first**:
   - Begin with UI components like buttons, inputs, and cards
   - Then move to layout components like headers and footers
   - Finally, convert complex page components

2. **For each component**:
   - Remove the `<style>` section
   - Add Tailwind classes directly to HTML elements
   - For complex animations or effects, keep minimal CSS
   - Use `@apply` for highly reused class combinations

3. **Keep track of your progress**:
   - Create a checklist of components to migrate
   - Test each component after conversion to ensure it looks identical

## Handling Complex Cases

### Gradients
```html
<!-- SCSS: background: linear-gradient(135deg, #FF6B6B, #FF8E53); -->
<div class="bg-gradient-to-r from-primary to-[#FF8E53]"></div>
```

### Animations
```html
<!-- For complex animations, keep minimal CSS and use Tailwind for everything else -->
<div class="animate-float transition-all duration-300"></div>
```

### Complex layouts
```html
<!-- Use Tailwind's grid and flex utilities -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
```

## Best Practices

1. **Be consistent** - Use the same approach throughout your project
2. **Avoid inline styles** - Use Tailwind classes whenever possible
3. **Use `@apply` sparingly** - Only for truly reusable patterns
4. **Keep a small amount of custom CSS** - For animations and complex effects
5. **Use comments** - Add comments for complex class combinations

## Testing Your Migration

1. Create side-by-side comparisons of components before and after migration
2. Test on different screen sizes to ensure responsive behavior is preserved
3. Check all interactive states (hover, focus, active) for each component

By following this guide, you can successfully migrate your project from SCSS to Tailwind CSS while maintaining your current design system.