# Lymetales

Lymetales is a premium e-commerce frontend for personalized children's books. The design prioritizes a high-end, emotionally engaging storytelling experience over a traditional, cluttered retail layout. It draws inspiration from modern, editorial web design to create a sense of "Storybook Wonder."

## 🎨 Design System & Aesthetics

The visual language of Lymetales is built around the concept of **"Premium Storybook."** It uses layered depth, elegant typography, and a harmonious pastel palette to create a magical first impression.

### Color Palette
*   **Primary Brand:** Dark Green (`#0F4C3A`) — Used for primary text, CTAs, and the footer to ground the pastel colors.
*   **Neutrals:** Cream/Bone (`#FAFAF9`), White (`#FFFFFF`), Soft Gray (`#777` for muted text).
*   **Storybook Pastels:**
    *   Pastel Mint (`#E1F3EA`)
    *   Pastel Yellow (`#FEF9E7`)
    *   Pastel Blue (`#EAF4FA`)
    *   Pastel Pink (`#FDE0D9`)

### Typography
*   **Headings:** *Cormorant* (Georgia serif fallback) — Used for graceful, editorial headlines.
*   **Body & UI:** *Montserrat* (Sans-serif fallback) — Used for crisp, legible UI elements, badges, and descriptions.

### UI Principles & Micro-interactions
*   **Soft Depth:** Products and cards feature layered, diffused box-shadows (`0 24px 56px rgba(0,0,0,0.14)`) with subtle glow rings behind main product images.
*   **Hover Lifts:** Interactive cards and thumbnails smoothly elevate (`translateY(-4px)`) and increase shadow depth on hover.
*   **Rounded Geometry:** Soft radii (`14px` for main cards, `8px` for inner elements, pill shapes for buttons) keep the interface friendly and safe.
*   **Glassmorphism:** Sticky headers and floating CTA bars utilize translucent backgrounds with background-blur (`backdrop-filter: blur(16px)`) to maintain context while scrolling.

## 🏗️ Layout & Architecture

The site uses a responsive, mobile-first approach scaling up to a `1320px` maximum width container.

### 1. Homepage (`index.html`)
*   **Sticky Header:** Prominent navigation, search, user, and cart icons.
*   **Cinematic Split Hero:** Instead of a generic full-width banner, it uses a sophisticated split-panel design (pastel text block on one side, lifestyle imagery on the other, with a floating book mockup breaking the grid).
*   **Category & Product Grids:** Clean visual hierarchy guiding users to specific book types (e.g., "Gifts for Dad", "Siblings").
*   **Trust & Story:** Circular process sections and FAQ accordions.

### 2. Premium Product Detail Page / PDP (`product.html`)
The PDP is highly optimized for conversion through emotional connection rather than aggressive sales tactics.
*   **Above the Fold (2-Column Grid):**
    *   *Left:* Interactive visual gallery. Main image has a subtle "breathing" floating effect and hover-to-zoom. Thumbnail clicks switch the active view smoothly.
    *   *Right:* Clean product meta (large italicized title, explicit price with delivery chip) and the **Configurator Card**.
*   **Interactive Configurator:** A highly polished "Personalise your book" UI featuring:
    *   Live name input preview hints.
    *   Custom icon-based radio buttons for character gender 👧👦.
    *   Interactive, animated color swatches for skin and hair tones (scales up with a checkmark on active state).
*   **Editorial Story Sections:** Alternating text and image blocks that explain the emotional value of the book.
*   **"Inside the Book" Showcase:** A horizontal scrolling strip showing inner page spreads to build anticipation.
*   **Review Engine:** A detailed review summary with visual percentage bars, interactive star-rating hover forms, and verified purchaser cards.
*   **Sticky Mini-bar:** On desktop, scrolling past the primary CTA triggers a glassmorphic sticky bar at the top with a secondary "Create Your Book" button. On mobile, this becomes a persistent bottom-fixed CTA.

## 💻 Tech Stack
*   **HTML5:** Semantic structure.
*   **Vanilla CSS3:** Extensive use of CSS Custom Properties (variables) for the design system, CSS Grid/Flexbox for layouts, and CSS animations/transitions for micro-interactions.
*   **Vanilla JavaScript:** Lightweight DOM manipulation for the image gallery, configurator state management, review star interactions, and `IntersectionObserver` for the sticky CTA bar. No heavy frameworks required.
