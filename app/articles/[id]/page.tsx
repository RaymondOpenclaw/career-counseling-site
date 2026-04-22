import { articles } from '@/data/mock';
import ArticleDetailClient from './ArticleDetailClient';

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  return <ArticleDetailClient id={params.id} />;
}
