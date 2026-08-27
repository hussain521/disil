/**
 * Scroll Utility for Marketing Navbar Navigation
 * Dynamically measures navbar height and calculates exact scroll offset
 * to align target section at the top of the viewport under the navbar.
 */

export function getDynamicNavbarOffset(extraPadding = 12): number {
  const headerEl = document.querySelector("header");
  if (!headerEl) return 90;

  const rect = headerEl.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(headerEl);
  
  // Account for position top offset (e.g., top-4 = 16px, top-6 = 24px)
  const topPos = parseFloat(computedStyle.top) || 0;
  
  // Total height from viewport top = header height + top offset + small professional padding
  return Math.round(rect.height + topPos + extraPadding);
}

export function scrollToSection(sectionId: string, onComplete?: () => void) {
  // 1. Resolve element target
  let element = document.getElementById(sectionId);

  // Fallbacks if section ID has alternative aliases
  if (!element) {
    if (sectionId === "how-it-works" || sectionId === "truck-types") {
      element =
        document.getElementById("how-it-works") ||
        document.getElementById("process") ||
        document.getElementById("truck-types");
    } else if (sectionId === "app-download") {
      element =
        document.getElementById("app-download") ||
        document.getElementById("app-screens");
    }
  }

  if (!element) {
    if (onComplete) onComplete();
    return;
  }

  // 2. Calculate dynamic navbar offset accurately
  const headerOffset = getDynamicNavbarOffset(12);

  // 3. Absolute element position in document
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.scrollY;

  // 4. Calculate target scroll Y (ensuring non-negative)
  const targetScrollY = Math.max(0, absoluteElementTop - headerOffset);

  // 5. Execute smooth scroll
  window.scrollTo({
    top: targetScrollY,
    behavior: "smooth",
  });

  if (onComplete) {
    onComplete();
  }
}