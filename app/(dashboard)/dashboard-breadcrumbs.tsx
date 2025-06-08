import React, { Fragment } from 'react';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbItem = {
    label: string;
    href?: string;
    icon?: React.ReactNode;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    className?: string;
};

export function DashboardBreadcrumbs({
    items,
    separator = <BreadcrumbSeparator />,
    className = '',
}: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={className}>
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => (
                        <Fragment key={`${item.label}-${index}`}>
                            <BreadcrumbItem>
                                {item.href ? (
                                    <>
                                        {item.icon && <span className="mr-2">{item.icon}</span>}
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href}>{item.label}</Link>
                                        </BreadcrumbLink>
                                    </>
                                ) : (
                                    <>
                                        {item.icon && <span className="mr-2">{item.icon}</span>}
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    </>
                                )}
                            </BreadcrumbItem>
                            {index < items.length - 1 && separator}
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
}
