'use client';

import { useQuery } from '@tanstack/react-query';
import { CustomersTable } from './customers-table';
import { fetchCustomers } from 'app/api/customer';

interface Props {
    offset: number;
    totalProducts: number;
}

export default function CustomersTableWrapper({ offset, totalProducts }: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: () => fetchCustomers(),
    });
    console.log(`this is data ${data}`)
    return (
        <CustomersTable
            customers={data?.customers || []}
            offset={offset}
            totalProducts={totalProducts}
        />
    );
}
