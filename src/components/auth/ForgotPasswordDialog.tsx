import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
  onSent?: () => void;
};

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
  defaultEmail,
  onSent,
}: Props) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail ?? "");
      setError(null);
      setIsLoading(false);
    }
  }, [open, defaultEmail]);

  const handleSend = async () => {
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // implementation here
      // Dummy implementation: in production this would request a password reset email from the backend.
      await new Promise((r) => setTimeout(r, 650));
      onSent?.();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email Address</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button className="w-full" onClick={handleSend} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
