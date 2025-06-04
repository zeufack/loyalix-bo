import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CustomersTable } from './customers-table';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomers } from 'app/api/customer';
import CustomersTableWrapper from './customers-table-wrapper';

export default async function CustomersPage() {
    const session = await auth();

    let newOffset = 10;
    let totalProducts = 50;

    if (!session) {
        redirect('/login');
    }
    return (
        <CustomersTableWrapper offset={newOffset} totalProducts={totalProducts} />
    );
}
