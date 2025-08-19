'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { createLoyaltyProgram } from '@/app/api/loyalty-program';

export function CreateLoyaltyProgramForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        businessId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await createLoyaltyProgram(formData);
            // Optionally, you can close the dialog and refresh the loyalty program list here.
        } catch (error) {
            setError('Failed to create loyalty program.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Loyalty Program</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Loyalty Program</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new loyalty program.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            className="col-span-3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            className="col-span-3"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="businessId">Business ID</Label>
                        <Input
                            id="businessId"
                            className="col-span-3"
                            value={formData.businessId}
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
