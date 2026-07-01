import './globals.css';

export const metadata = {
  title: 'Sakinah Quranic LMS',
  description: 'A serene Quran Madrasa learning portal for students, teachers, and admins.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
