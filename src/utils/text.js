const Truncate = (title, len) => {
  if (title.length > len) return title.substring(0, len) + "...";
  else return title;
};

const generateSlug = (slug, changed) => {
  if (!changed) {
    slug = slug.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
    slug = slug.charAt(0).toLowerCase() + slug.slice(1); // Lowercase first word
  }
  slug = slug.replace(/[^a-zA-Z0-9_]/g, ""); // Remove special characters
  slug = slug.replace(/^\d+\.\s*/, ""); // Remove spaces
  slug = slug.charAt(0).replace(/[^a-zA-Z_]/, "") + slug.slice(1); // Remove leading number
  return slug;
};

export { Truncate, generateSlug };
