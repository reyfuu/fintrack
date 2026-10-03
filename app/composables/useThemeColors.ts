/**
 * Resolves the CSS colour tokens into plain strings for consumers that cannot
 * use CSS — Chart.js draws to a canvas, so it needs literal colours rather than
 * var() references.
 *
 * Recomputes whenever the colour mode changes, so the charts restyle on a theme
 * toggle instead of keeping the previous palette until the next data fetch.
 */
const TOKENS = [
  'bg', 'surface', 'elevated', 'border', 'fg', 'muted', 'subtle',
  'brand', 'income', 'expense', 'cash', 'digital',
  'cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6', 'cat-7', 'cat-8',
] as const

export type ThemeColors = Record<(typeof TOKENS)[number], string>

export function useThemeColors() {
  const colorMode = useColorMode()

  const read = (): ThemeColors => {
    const styles = getComputedStyle(document.documentElement)
    return Object.fromEntries(
      TOKENS.map(t => [t, styles.getPropertyValue(`--color-${t}`).trim()]),
    ) as ThemeColors
  }

  // SPA mode, so this only ever runs in the browser — but default sensibly
  // rather than throwing if that assumption ever changes.
  const colors = ref<ThemeColors>(
    import.meta.client ? read() : ({} as ThemeColors),
  )

  watch(() => colorMode.value, async () => {
    // Wait for the class/attribute swap to land before reading back.
    await nextTick()
    colors.value = read()
  })

  onMounted(() => { colors.value = read() })

  const categoryPalette = computed(() => [
    colors.value['cat-1'], colors.value['cat-2'], colors.value['cat-3'], colors.value['cat-4'],
    colors.value['cat-5'], colors.value['cat-6'], colors.value['cat-7'], colors.value['cat-8'],
  ])

  return { colors, categoryPalette }
}
