import AuthenticatedLayout from '@/app/components/AuthenticatedLayout';

export default function FinancialIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
