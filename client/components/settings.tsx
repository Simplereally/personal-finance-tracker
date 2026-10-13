import { useState } from "preact/hooks";
import type { Actions } from "../types";
import { Icon } from "./icons";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Field,
  Input,
  Spinner,
} from "./ui";
import { FormError } from "./forms";
export function CategoryManager({
  categories,
  onCreate,
  onDelete,
}: {
  categories: { id: string; name: string }[];
  onCreate: Actions["createCategory"];
  onDelete: Actions["deleteCategory"];
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your own categories</CardTitle>
        <Icon name="bag" size={18} className="text-[#826b77]" />
      </CardHeader>
      <CardContent>
        <form
          className="flex items-end gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            setError("");
            setBusy(true);
            try {
              await onCreate(String(data.get("category")));
              form.reset();
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Couldn’t add this category.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="flex-1">
            <Field label="New category">
              <Input
                name="category"
                required
                maxLength={40}
                placeholder="e.g. Books & little treasures"
              />
            </Field>
          </div>
          <Button
            type="submit"
            disabled={busy}
            size="icon"
            className="min-h-12 w-12!"
            aria-label="Add category"
          >
            <Icon name="plus" size={18} />
          </Button>
        </form>
        {categories.length > 0 && (
          <ul className="mt-4 divide-y divide-[#eee5df]">
            {categories.map((category) => (
              <li className="flex items-center justify-between gap-2 py-2">
                <span className="text-sm text-[#806675]">{category.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={busy}
                  aria-label={`Remove ${category.name} category`}
                  onClick={() => setPending(category.id)}
                >
                  <Icon name="trash" size={15} />
                </Button>
              </li>
            ))}
          </ul>
        )}
        {pending && (
          <div className="mt-4 rounded-xl bg-[#f7e8ec] p-4">
            <p className="mb-3 text-sm">Remove this category and its budget?</p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await onDelete(pending);
                    setPending(null);
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "Couldn’t remove this category.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Remove category
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPending(null)}
              >
                Keep it
              </Button>
            </div>
          </div>
        )}
        <div className="mt-4">
          <FormError error={error} />
        </div>
      </CardContent>
    </Card>
  );
}

export function PasswordCard({
  onSave,
}: {
  onSave: Actions["changePassword"];
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password & security</CardTitle>
        <Icon name="lock" size={18} className="text-[#826b77]" />
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            setBusy(true);
            setError("");
            setSuccess(false);
            try {
              if (data.get("next") !== data.get("confirm"))
                throw new Error("Your new passwords don’t match.");
              const result = await onSave(
                String(data.get("current")),
                String(data.get("next")),
              );
              if ("error" in result && result.error) setError(result.error);
              else {
                setSuccess(true);
                form.reset();
              }
            } catch (e) {
              setError(
                e instanceof Error
                  ? e.message
                  : "Couldn’t update your password.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Current password">
            <Input
              name="current"
              type="password"
              autoComplete="current-password"
              minLength={10}
              maxLength={128}
              required
            />
          </Field>
          <Field label="New password">
            <Input
              name="next"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
          </Field>
          <Field label="Confirm new password">
            <Input
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
          </Field>
          <FormError error={error} />
          {success && (
            <p role="status" className="text-sm leading-6 text-[#73927d]">
              Password updated. Other browser sessions have been signed out.
            </p>
          )}
          <Button variant="outline" type="submit" disabled={busy}>
            {busy ? <Spinner label="Updating" /> : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
