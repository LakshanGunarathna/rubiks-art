/**
 * Dynamically updates the document title, canonical URLs, and search/social meta tags.
 * This ensures search crawlers (like Google) and Google AdSense reviewers
 * index each dynamic SPA route with its relevant metadata and canonical link.
 */
export function updateMetaTags(title: string, description: string, imageUrl?: string) {
  // Update document title
  document.title = title;

  // Helper to get or create a meta tag
  const setMetaTag = (attribute: string, attrVal: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${attrVal}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, attrVal);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Update standard meta description
  setMetaTag('name', 'description', description);

  // Update OpenGraph tags
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);

  // Set canonical URL required for Google AdSense SPA verification
  const currentPath = window.location.pathname;
  const canonicalUrl = `https://www.rubiks-art.com${currentPath}`;
  setMetaTag('property', 'og:url', canonicalUrl);

  let canonicalElement = document.querySelector('link[rel="canonical"]');
  if (!canonicalElement) {
    canonicalElement = document.createElement('link');
    canonicalElement.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalElement);
  }
  canonicalElement.setAttribute('href', canonicalUrl);

  // Update image tags for Google Search and social crawlers
  if (imageUrl) {
    let absoluteImageUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      absoluteImageUrl = `https://www.rubiks-art.com${imageUrl}`;
    }
    setMetaTag('property', 'og:image', absoluteImageUrl);
    setMetaTag('name', 'twitter:image', absoluteImageUrl);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
  }
}
