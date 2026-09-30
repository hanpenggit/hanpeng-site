// Section links ("#work", "#projects", …) only resolve on the landing page.
// From any other route they need the leading "/" so the browser goes home
// first and then jumps to the anchor.
export function sectionHref(pathname: string, hash: string): string {
  return pathname === "/" ? hash : `/${hash}`;
}
