import Image from 'next/image';
import { TableCell, TableRow } from '../../../components/ui/table';
import { Customer } from '../../../types/customer';
import { Badge } from '../../../components/ui/badge';

export function CustomerItem({ customer }: { customer: Customer }) {
    return (
        <TableRow>
            {/* Image column (hidden on small screens) */}
            <TableCell className="hidden sm:table-cell">
                {/* <Image ... /> */}
            </TableCell>

            {/* Name */}
            <TableCell className="font-medium">
                {customer.user.firstName} {customer.user.lastName}
            </TableCell>

            {/* Status */}
            <TableCell>
                <Badge variant={customer.user.isActive ? "default" : "destructive"}>
                    {customer.user.isActive ? "Active" : "Inactive"}
                </Badge>
            </TableCell>

            {/* Price (hidden on medium screens) */}
            <TableCell className="hidden md:table-cell">
                {/* Add price data if available */}
            </TableCell>

            {/* Total Sales (hidden on medium screens) */}
            <TableCell className="hidden md:table-cell">
                {/* Add sales data */}
            </TableCell>

            {/* Created At (hidden on medium screens) */}
            <TableCell className="hidden md:table-cell">
                {new Date(customer.createdAt).toLocaleDateString()}
            </TableCell>

            {/* Actions */}
            <TableCell>
            </TableCell>
        </TableRow>
    );
}
