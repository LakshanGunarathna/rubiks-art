/**
 * Dynamically updates the document title and search/social meta tags.
 * This ensures search crawlers (like Google) and social sharing bots
 * index each page with its relevant metadata.
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
