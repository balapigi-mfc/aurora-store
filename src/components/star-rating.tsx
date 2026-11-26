import { StarIcon } from "@/components/icons";
import { classNames } from "@/lib/format";

export function StarRating({
  rating,
  size = "sm",
  showValue = false,
  count,
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  count?: number;
  className?: string;
}) {
  const dimension = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className={classNames("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5 text-clay">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            filled={star <= Math.round(rating)}
            className={classNames(
              dimension,
              star <= Math.round(rating) ? "" : "text-ink/20",
            )}
          />
        ))}
      </div>
      {showValue ? (
        <span className="text-xs text-ink/50">
          {rating.toFixed(1)}
          {typeof count === "number" ? ` (${count})` : ""}
        </span>
      ) : null}
    </div>
  );
}
