import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";

type Ref = HTMLSpanElement;

type FeedbackProps = ComponentProps<"span"> & {
  message?: string | null;
};

const Feedback = forwardRef<Ref, FeedbackProps>(
  ({ className, message, ...props }, ref) => {
    if (!message) return null;

    return (
      <span className={cn("text-xs text-red-600")} {...props}>
        {message}
      </span>
    );
  }
);

Feedback.displayName = "Feedback";

export { Feedback };
