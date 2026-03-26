import '../styles/globals.css'

export const metadata = {
  title: 'Foxy Theme Editor',
  description: 'Customize your Foxy Templates theme',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
