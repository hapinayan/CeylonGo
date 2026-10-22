# CeylonGo – Frontend Design System & Engineering Foundation

> **Project Name:** CeylonGo  
> **Tagline:** Discover Local. Feel at Home.  
> **Platform:** Sri Lankan Homestay Booking and Community-Based Tourism Platform  
> **Architecture:** Angular (Standalone Components) + TypeScript + SCSS Design Tokens  
> **Target Frontend Deadline:** 29 October 2026  
> **Team:** 5 Frontend Engineers  

---

## 1. Visual Identity & Design Principles

CeylonGo is built to reflect the authentic warmth, vibrant natural beauty, and rich hospitality of Sri Lanka. All five developers must adhere strictly to these principles so the entire platform looks and feels like a single, cohesive, world-class tourism product.

### Core Visual Guidelines

1. **Clean White Navigation & Surfaces:** Standard background is crisp white (`#FFFFFF`) with soft neutral backgrounds (`#F8FAFC`).
2. **Navy Blue Authority:** Primary typography, brand headers, and primary actions utilize CeylonGo Navy (`#082B5C`).
3. **Warm Sri Lankan Orange:** Call-to-action buttons, active navigation indicators, badges, and highlights utilize Accent Orange (`#FF9F1C`).
4. **Sigiriya & Island Photography:** Hero and card images feature authentic Sri Lankan photography, never generic placeholders.
5. **Soft Shadows & Subtle Borders:** Components use delicate slate borders (`#E2E8F0`) and smooth drop shadows (`0 4px 20px -2px rgba(15, 23, 42, 0.08)`).
6. **Standard Radii:** Standard card border-radius is **12px**, standard input border-radius is **8px**, and search bars/pills use **9999px**.

---

## 2. Centralized Design Tokens (CSS Custom Properties)

All tokens are defined in `src/styles/_tokens.scss` and exposed globally via `src/styles/_root.scss`. **Never hardcode hex values or random pixels in component stylesheets.**

### 2.1 Color Palette

| Token Name | CSS Custom Property | Hex Value | Intended Usage |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | `--cg-primary` | `#082B5C` | Hero headings, brand headers, primary buttons, logo |
| **Primary Hover** | `--cg-primary-hover` | `#062045` | Hover state for primary buttons and dark links |
| **Primary Subtle** | `--cg-primary-subtle` | `#F0F4F9` | Active nav link background, subtle icon backgrounds |
| **Accent Orange** | `--cg-accent` | `#FF9F1C` | Main CTA buttons, active state line, star ratings |
| **Accent Hover** | `--cg-accent-hover` | `#E58E17` | Hover state for CTA buttons |
| **Background White** | `--cg-background` | `#FFFFFF` | Default page background, card surfaces, modal body |
| **Light Background** | `--cg-bg-light` | `#F8FAFC` | Page container background, filter panels, demo areas |
| **Primary Text** | `--cg-text-primary` | `#0F172A` | Main body text, card titles, table text |
| **Secondary Text** | `--cg-text-secondary` | `#475569` | Subtitles, descriptions, metadata, inactive links |
| **Muted Text** | `--cg-text-muted` | `#94A3B8` | Input placeholders, captions, disabled text |
| **Border Slate** | `--cg-border` | `#E2E8F0` | Card borders, input borders, dividers, subtle outlines |
| **Success** | `--cg-success` | `#10B981` | Eco-certified badges, successful booking confirmations |
| **Warning** | `--cg-warning` | `#F59E0B` | Host alerts, availability notices, cancellation warnings |
| **Error / Danger** | `--cg-error` | `#EF4444` | Form validation errors, destructive action buttons |

### 2.2 Typography Scale

CeylonGo uses **Inter** as the primary font family with clean system font fallbacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`).

```css
font-family: var(--cg-font-family);
```

| Heading / Text Style | CSS Custom Property | Font Size | Font Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Heading** | `--cg-font-size-hero` | `3.25rem` (52px) | 800 (Extrabold) | 1.15 | Main homepage hero banner (`.cg-heading-hero`) |
| **Page Heading** | `--cg-font-size-page` | `2.25rem` (36px) | 700 (Bold) | 1.25 | Feature page `<h1>` titles (`.cg-heading-page`) |
| **Section Heading** | `--cg-font-size-section` | `1.75rem` (28px) | 700 (Bold) | 1.25 | Homepage sections, listing headers (`.cg-heading-section`) |
| **Card Heading** | `--cg-font-size-card` | `1.125rem` (18px) | 600 (Semibold) | 1.25 | Homestay names, tour cards (`.cg-heading-card`) |
| **Body Regular** | `--cg-font-size-body` | `1.0rem` (16px) | 400 (Regular) | 1.625 | Standard paragraphs, content text (`.cg-text-body`) |
| **Body Small** | `--cg-font-size-body-sm` | `0.875rem` (14px) | 400 / 500 | 1.5 | Secondary metadata, descriptions (`.cg-text-body-sm`) |
| **Form Label** | `--cg-font-size-label` | `0.875rem` (14px) | 600 (Semibold) | 1.2 | Input & dropdown labels (`.cg-text-label`) |
| **Caption & Badges** | `--cg-font-size-caption` | `0.75rem` (12px) | 700 (Bold) | 1.4 | Kickers, category badges, dates (`.cg-text-caption`) |

### 2.3 Spacing Scale (4px & 8px Increments)

Strictly utilize the 4px / 8px incremental scale for margins, paddings, and gaps:

| Token Name | Value | Rem Equivalent | Common Usage |
| :--- | :--- | :--- | :--- |
| `--cg-space-1` | 4px | `0.25rem` | Micro gaps, badge inner padding |
| `--cg-space-2` | 8px | `0.5rem` | Button gap, label bottom margin |
| `--cg-space-3` | 12px | `0.75rem` | Input horizontal padding, breadcrumb margins |
| `--cg-space-4` | 16px | `1.0rem` | Card body padding, compact section gap |
| `--cg-space-5` | 20px | `1.25rem` | Medium element spacing |
| `--cg-space-6` | 24px | `1.5rem` | Standard grid gap, section inner spacing |
| `--cg-space-8` | 32px | `2.0rem` | Page header bottom margin, modal padding |
| `--cg-space-10` | 40px | `2.5rem` | Large layout spacing |
| `--cg-space-12` | 48px | `3.0rem` | Section vertical padding |
| `--cg-space-16` | 64px | `4.0rem` | Major landing page block separators |

### 2.4 Border Radii & Shadows

- **Standard Card Radius:** `12px` (`--cg-radius-card`)
- **Standard Input Radius:** `8px` (`--cg-radius-input`)
- **Standard Button Radius:** `8px` (`--cg-radius-btn`)
- **Pill / Search Radius:** `9999px` (`--cg-radius-pill`)
- **Card Shadow (Resting):** `var(--cg-shadow-card)` (`0 4px 20px -2px rgba(15, 23, 42, 0.08)`)
- **Card Shadow (Hover):** `var(--cg-shadow-card-hover)` (`0 12px 28px -4px rgba(15, 23, 42, 0.14)`)

---

## 3. Shared Angular UI Components Library

All shared components are standalone and exported from:
`import { ... } from '../../shared/components';`

### Summary of the 16 Standard Shared Components

| # | Component Name | Selector | Primary Purpose |
| :- | :--- | :--- | :--- |
| 1 | `NavbarComponent` | `app-navbar` | Global sticky white navigation bar with logo, active link indicator, location picker, and profile avatar |
| 2 | `FooterComponent` | `app-footer` | Global multi-column footer with brand info, quick links, social links, and copyright |
| 3 | `PageContainerComponent` | `app-page-container` | Responsive max-width wrapper (`sm`, `md`, `lg`, `full`) with responsive padding |
| 4 | `PageHeaderComponent` | `app-page-header` | Standardized page title header with breadcrumbs slot and action buttons slot |
| 5 | `SectionHeaderComponent` | `app-section-header` | Section heading with kicker, title, orange highlighted text, and subtitle |
| 6 | `ButtonComponent` | `app-button` | Primary Navy, Orange CTA, Secondary, Outline, Ghost, Danger buttons with loading & disabled states |
| 7 | `SearchInputComponent` | `app-search-input` | Pill search box with search icon, debounce, and instant clear button |
| 8 | `FormInputComponent` | `app-form-input` | Standard 8px radius input with label, required marker, helper text, and error validation |
| 9 | `SelectComponent` | `app-select` | Accessible custom dropdown with options list, keyboard navigation, and outside-click dismiss |
| 10 | `FilterPanelComponent` | `app-filter-panel` | Filter sidebar for Sri Lankan districts (Kandy, Ella, Galle, etc.), categories, price range, and ratings |
| 11 | `ListingCardComponent` | `app-listing-card` | 12px tourism listing card with image, badge, wishlist heart toggle, rating, and LKR pricing |
| 12 | `LoadingStateComponent` | `app-loading-state` | Brand spinner or animated shimmer skeleton cards |
| 13 | `EmptyStateComponent` | `app-empty-state` | Friendly SVG illustration with title, explanation, and action CTA button |
| 14 | `ErrorStateComponent` | `app-error-state` | Graceful error state with alert icon, message, and retry button |
| 15 | `ConfirmationDialogComponent` | `app-confirmation-dialog` | Modal dialog with backdrop blur, keyboard escape listener, and confirm/cancel actions |
| 16 | `BreadcrumbsComponent` | `app-breadcrumbs` | Accessible breadcrumb navigation trail with chevron separators |

---

## 4. Component Usage Specifications & Code Examples

### 4.1 Button (`app-button`)

```html
<!-- Primary Navy Button -->
<app-button variant="primary" size="md" (btnClick)="onSave()">
  Save Changes
</app-button>

<!-- Main Call-To-Action (Orange) -->
<app-button variant="cta" size="lg" (btnClick)="onBookNow()">
  Book Homestay
</app-button>

<!-- Secondary Outline & Loading State -->
<app-button variant="secondary" size="md" [loading]="isLoading">
  Processing Booking
</app-button>

<!-- Danger Action -->
<app-button variant="danger" size="sm" (btnClick)="onCancel()">
  Delete
</app-button>
```

### 4.2 Page Container & Page Header

```html
<app-page-container size="lg" padding="md">
  <!-- Page Header with Breadcrumbs & Action Buttons -->
  <app-page-header
    title="Explore Homestays in Ella"
    kicker="BADULLA DISTRICT • CENTRAL HIGHLANDS"
    subtitle="Authentic hillside family homes, tea estate retreats, and traditional Sri Lankan cuisine."
  >
    <app-breadcrumbs
      breadcrumbs
      [items]="[
        { label: 'Homestays', url: '/homestays' },
        { label: 'Ella' }
      ]"
    ></app-breadcrumbs>

    <div actions>
      <app-button variant="secondary" size="sm">Export List</app-button>
      <app-button variant="cta" size="sm">Host a Stay</app-button>
    </div>
  </app-page-header>
</app-page-container>
```

### 4.3 Section Header (`app-section-header`)

```html
<app-section-header
  kicker="WHAT YOU CAN DO WITH CEYLONGO"
  title="Simple Travel, "
  highlightText="Meaningful Experiences"
  subtitle="Stay with local families and experience real Sri Lankan hospitality across all 25 districts."
  align="center"
></app-section-header>
```

### 4.4 Form Input (`app-form-input`)

```html
<app-form-input
  label="Guest Full Name"
  placeholder="e.g. Hapinayan S."
  [required]="true"
  hintMessage="Enter name as per passport or national ID."
></app-form-input>

<!-- With validation error -->
<app-form-input
  label="Email Address"
  type="email"
  placeholder="traveler@example.com"
  [required]="true"
  [errorMessage]="emailError"
></app-form-input>
```

### 4.5 Select Dropdown (`app-select`)

```typescript
// In your component.ts:
protected readonly districtOptions = [
  { label: 'Badulla / Ella District', value: 'ella', icon: '⛰️' },
  { label: 'Kandy Central Highlands', value: 'kandy', icon: '🏛️' },
  { label: 'Galle Coastal District', value: 'galle', icon: '🌊' }
];
protected selectedDistrict = 'ella';
```

```html
<app-select
  label="Select Destination"
  [options]="districtOptions"
  [value]="selectedDistrict"
  (valueChange)="selectedDistrict = $event"
  [required]="true"
></app-select>
```

### 4.6 Reusable Listing Card (`app-listing-card`)

```typescript
protected readonly stayItem: ListingCardData = {
  id: 'hs-101',
  title: 'Misty Ella Tea Valley Homestay',
  location: 'Ella, Badulla District',
  imageUrl: 'assets/images/homestays/homestay_ella.jpg',
  price: 12500,
  priceUnit: 'night',
  rating: 4.95,
  reviewCount: 48,
  badge: 'Superhost',
  badgeVariant: 'accent',
  isFavorite: true
};
```

```html
<app-listing-card
  [item]="stayItem"
  ctaLabel="View Details"
  (cardClick)="openDetails($event)"
  (favoriteToggle)="onToggleFav($event)"
></app-listing-card>
```

### 4.7 Filter Panel (`app-filter-panel`)

```html
<app-filter-panel
  title="Filter Accommodations"
  [showCategoryFilter]="true"
  [showDistrictFilter]="true"
  [showPriceFilter]="true"
  [showRatingFilter]="true"
  (filterChange)="onFilterChange($event)"
  (reset)="onResetFilters()"
></app-filter-panel>
```

### 4.8 Feedback States (Loading, Empty, Error)

```html
<!-- Loading Spinner -->
<app-loading-state
  mode="spinner"
  message="Loading available homestays in Kandy..."
></app-loading-state>

<!-- Loading Skeleton Shimmer -->
<app-loading-state
  mode="skeleton"
  [skeletonCount]="3"
></app-loading-state>

<!-- Empty State -->
<app-empty-state
  title="No Homestays Found"
  description="Try expanding your budget or adjusting your check-in dates."
  actionText="Clear Filters"
  (action)="resetFilters()"
></app-empty-state>

<!-- Error State -->
<app-error-state
  title="Failed to Load Availability"
  message="We could not connect to CeylonGo booking servers."
  retryText="Retry Search"
  (retry)="reload()"
></app-error-state>
```

### 4.9 Confirmation Dialog Modal (`app-confirmation-dialog`)

```html
<app-confirmation-dialog
  [isOpen]="isCancelDialogOpen"
  variant="danger"
  title="Cancel Booking?"
  message="Are you sure you want to cancel this booking? This action cannot be undone."
  confirmText="Yes, Cancel Booking"
  cancelText="Keep Booking"
  (confirm)="confirmCancellation()"
  (close)="isCancelDialogOpen = false"
></app-confirmation-dialog>
```

---

## 5. Team Architectural Structure & Collaboration Rules

### 5.1 Project Layout

```text
src/app/
├── core/
│   ├── guards/                    <-- Auth & route protection guards
│   ├── services/                  <-- Core singleton services
│   └── layout/                    <-- Standard Public Layout
│       ├── navbar/                <-- Reusable CeylonGo main navbar
│       ├── footer/                <-- Reusable CeylonGo main footer
│       └── public-layout/         <-- Wrapper containing <router-outlet>
├── shared/
│   ├── components/                <-- Reusable UI library (The 16 components)
│   │   ├── button/
│   │   ├── page-container/
│   │   ├── page-header/
│   │   ├── section-header/
│   │   ├── search-input/
│   │   ├── form-input/
│   │   ├── select/
│   │   ├── filter-panel/
│   │   ├── listing-card/
│   │   ├── loading-state/
│   │   ├── empty-state/
│   │   ├── error-state/
│   │   ├── confirmation-dialog/
│   │   ├── breadcrumbs/
│   │   └── index.ts               <-- Central barrel export
│   ├── models/                    <-- Shared TypeScript interfaces (tourism & UI)
│   └── utilities/                 <-- Common date/currency formatters
├── features/
│   ├── home/                      <-- Homepage module
│   ├── auth/                      <-- Authentication & accounts
│   ├── design-system/             <-- Live Interactive Design System Showcase
│   ├── homestays/                 <-- Developer 1 Module
│   ├── experiences/               <-- Developer 2 Module
│   ├── tour-guides/               <-- Developer 3 Module
│   ├── ai-planner/                <-- Developer 4 Module
│   └── ...                        <-- Other assigned modules
└── app.routes.ts                  <-- Central application route config
```

### 5.2 Team Development Golden Rules

1. **Do NOT Re-Create Navbar or Footer:** Every page automatically renders through `PublicLayoutComponent`. Do not add an `<app-navbar>` or `<header>` inside your feature component.
2. **Do NOT Hardcode Hex Colors:** Always use `var(--cg-primary)`, `var(--cg-accent)`, `var(--cg-border)`, etc.
3. **Do NOT Write Ad-Hoc Buttons:** Use `<app-button variant="...">`. This guarantees consistent focus rings, hover lift, active state, and accessibility.
4. **Do NOT Style Plain Inputs:** Use `<app-form-input>` or `<app-select>` to ensure proper 8px radius, accessible labels, and responsive layout.
5. **Keep Feature Code Isolated:** Keep models, services, and state specific to your module inside your feature directory (`features/<module-name>/`).
6. **Use Standalone Components:** All Angular components are standalone (`standalone: true`). Import the shared components directly in your `imports: [ ... ]` array.

---

## 6. Live Interactive Showcase

To explore every component in action with live controls, start the development server and navigate to:

```text
http://localhost:4200/design-system
```

This page displays:
- All 8 approved color swatches with CSS variable names
- Typography scale hierarchy
- Live button variants (Navy, Orange CTA, Secondary, Danger, Loading)
- Form inputs, search boxes, and dropdown select
- Interactive filter panel connected to responsive listing cards
- Animated spinners and shimmer skeleton loaders
- Empty states, error states, and modal dialogs

---
*CeylonGo Frontend Team – Final Year Software Development Project (2026)*
