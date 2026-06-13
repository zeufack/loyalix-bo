import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import MediaGallery from './media-gallery';

export default async function MediaPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <MediaGallery />;
}
