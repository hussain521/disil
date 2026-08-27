/**
 * Scroll Utility for Marketing Navbar Navigation
 * Dynamically measures navbar height and calculates exact scroll offset
 * to align target section at the top of the viewport under the navbar.
 */

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

  // 2. Calculate dynamic navbar offset
  // The header is sticky at top-4 (16px) or sm:top-6 (24px)
  const headerEl = document.querySelector("header");
  let headerOffset = 84; // Safe default estimate

  if (headerEl) {
    const rect = headerEl.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(headerEl);
    const topMargin = parseFloat(computedStyle.top) || 16;
    
    // Total offset = Header height + top margin + 12px clean breathing space
    headerOffset = Math.round(rect.height + topMargin + 12);
  }

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