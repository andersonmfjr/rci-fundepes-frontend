import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ExtractDetailsModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClose = () => navigate("/extracts", { replace: true });

  return (
    <Dialog open={!!searchParams.get("current")} onOpenChange={handleClose}>
      <form>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detalhes do extrato</DialogTitle>
            <DialogDescription>
              Na tabela estão as tranferências contidas no extrato.
            </DialogDescription>
          </DialogHeader>

          <div className=""></div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
