import { File } from "lucide-react";
import { Button } from "./button";

export default function ExportButton() {
    return (
        <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
            </span>
        </Button>
    )
}
