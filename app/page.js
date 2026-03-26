'use client'

import dynamic from 'next/dynamic'

const FoxyThemeEditor = dynamic(
  () => import('../foxy-theme-editor_1'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="app-root">
      <FoxyThemeEditor />
    </main>
  )
}
