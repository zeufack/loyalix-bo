import { PlusCircle } from "lucide-react";
import { Button } from "./button";

export default function AddItemButton() {
    return (
        <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Customers
            </span>
        </Button>
    );
}
