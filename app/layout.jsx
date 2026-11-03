import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import { ToastProvider } from '@/components/ToastContext';

export const metadata = {
  title: 'KINETIK — Event Production & Organizer',
  description: 'Hidupkan setiap momen bersama KINETIK. Partner kreatif produksi acara, sound & lighting, dan festival.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-[100dvh] flex flex-col bg-[#171717] text-[#ffffff] selection:bg-[#ff6b35] selection:text-[#171717]">
        <ToastProvider>
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
