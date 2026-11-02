import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'KINETIK Event Production & Organizer — Platform Manajemen Acara & Tiket',
  description: 'Aplikasi website Event Organizer kewirausahaan digital terintegrasi MySQL, multi-aktor login, payment gateway sandbox, dan laporan keuangan PDF.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-[100dvh] flex flex-col bg-[#FFFDF9] text-[#121212]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
