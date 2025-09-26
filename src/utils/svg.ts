export function toDataUriSvg(svg: string): string {
  if (!svg) return '';

  if (svg.startsWith('data:image/svg+xml;')) {
    return svg;
  }
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (base64Regex.test(svg) && svg.length > 20) {
    try {
      atob(svg);
      return `data:image/svg+xml;base64,${svg}`;
    } catch {
    }
  }

  if (svg.trim().startsWith('<svg')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}