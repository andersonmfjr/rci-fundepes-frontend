import { UploadExtractModal } from "@/components/extracts/upload-extract-modal";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

export function ExtractsManagement() {
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [])


    return (
        <Layout>
            <div className="container mx-auto py-6 space-y-6">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Extratos</h1>
                        <p className="text-gray-600">
                            Gerencie os extratos das contas de RCI
                        </p>
                    </div>
                </header>
                <Button onClick={() => setOpen(true)}>
                    Adicionar extrato
                    <Plus />
                </Button>
            </div>
            <UploadExtractModal onOpenChange={handleClose} open={open} />
        </Layout>
    )
}