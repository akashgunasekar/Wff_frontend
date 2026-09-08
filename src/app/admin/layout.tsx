import AdminAuthProvider from './AdminAuthProvider';

export const metadata = {
  title: 'Administration | WFF Tamil Nadu',
  robots: 'noindex, nofollow'
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
