import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";

type UploadExtractModalProps = {
    open: boolean;
    onOpenChange(): void
}

export function UploadExtractModal({ open, onOpenChange }: UploadExtractModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar um novo extrato</DialogTitle>
                        <DialogDescription>
                            Faça o upload do arquivo .OFX nesta área abaixo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="">
                        <label className="border-dashed border-2 rounded-md h-56 flex items-center justify-center cursor-pointer" htmlFor="ofx-file">
                            <Upload className="text-gray-500" />
                        </label>
                        <input type="file" id="ofx-file" className="hidden" />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Enviar</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
