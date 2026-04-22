import { counselors } from '@/data/mock';
import CounselorDetailClient from './CounselorDetailClient';

export function generateStaticParams() {
  return counselors.map((c) => ({ id: c.id }));
}

export default function CounselorDetailPage({ params }: { params: { id: string } }) {
  return <CounselorDetailClient id={params.id} />;
}
