import { CATEGORIES } from "../../shared/finance";
import { Icon } from "./icons";
export function CategoryBadge({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  const category = CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[7];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${small ? "size-9" : "size-10"}`}
      style={{ backgroundColor: category.tint, color: category.color }}
    >
      <Icon name={category.icon} size={small ? 16 : 18} />
    </span>
  );
}
