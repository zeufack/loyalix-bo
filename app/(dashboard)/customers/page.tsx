import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function CustomersPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>View all customers and their orders.</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    );
}
