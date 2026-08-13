import { Check } from "lucide-react";
import { passwordRules } from "../../constants/passwordPolicy";

interface PasswordChecklistProps {
  password: string;
}

/**
 * Not a `@lynkflow/ui-kit` component. Dropped the reference implementation's
 * `console.log` per rule check -- debug logging left in from development,
 * not intentional.
 */
export default function PasswordChecklist({ password }: PasswordChecklistProps) {
  return (
    <ul className="space-y-1.5">
      {passwordRules.map((rule) => {
        const passed = rule.test(password);
        return (
          <li key={rule.id} className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                passed ? "border-primary-500 bg-primary-500" : "border-neutral-300 bg-white"
              }`}
            >
              {passed && <Check size={10} className="text-white" strokeWidth={3} />}
            </span>
            <span className={passed ? "text-neutral-700" : "text-neutral-400"}>
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
