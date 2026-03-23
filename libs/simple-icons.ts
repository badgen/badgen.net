import iconsData from 'simple-icons/icons.json'

const slugToTitleMap = new Map<string, string>()

// According to simple-icons keys derivation logic
for (const icon of (iconsData as any)) {
  slugToTitleMap.set(icon.slug, icon.title)
}

export async function getSiIcon (name: string) {
  const slug = nameToSlug(name)

  if (slugToTitleMap.has(slug)) {
    const allIcons = await import('simple-icons')
    // We iterate over the exports to find the one with the matching slug.
    // This is more reliable than trying to guess the export key (e.g. siNodeDotJs vs siNodedotjs)
    for (const key in allIcons) {
        const icon = allIcons[key]
        if (icon && typeof icon === 'object' && icon.slug === slug) {
            return icon
        }
    }
  }
  return null
}

function nameToSlug (name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/&/g, 'and')
    .replace(/[ !’'().-]/g, '')
}
