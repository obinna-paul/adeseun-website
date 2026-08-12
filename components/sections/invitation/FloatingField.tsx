"use client";

import { useId, type ChangeEvent, type TextareaHTMLAttributes, type InputHTMLAttributes } from "react";

type SharedProps = {
  label: string;
  required?: boolean;
  className?: string;
};

type FloatingInputProps = SharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "placeholder" | "className"> & { multiline?: false };

type FloatingTextareaProps = SharedProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "placeholder" | "className"> & { multiline: true };

/**
 * A floating label with no JS state at all — the classic `placeholder="
 * "` + `peer-[:not(:placeholder-shown)]` CSS trick. The label floats on
 * focus (`peer-focus`) and stays floated once there's content, even
 * after blur, without tracking a "hasValue" boolean in React.
 *
 * The textarea variant additionally grows with its content ("expands
 * gracefully," per the brief) — that one part does need JS, since
 * `height: auto` sizing requires reading `scrollHeight`. Done directly
 * in the change handler on the event target, not via an effect: no
 * extra render, no state to keep in sync.
 */
export function FloatingField(props: FloatingInputProps | FloatingTextareaProps) {
  const id = useId();
  const { label, required, multiline, className, ...rest } = props;

  const fieldClasses =
    "field-underline peer w-full resize-none border-b border-line bg-transparent pb-3 pt-6 font-body text-base text-text outline-none transition-colors duration-200 ease-gallery-standard focus:border-gold";
  const labelClasses =
    "pointer-events-none absolute left-0 top-6 origin-left font-body text-base text-text-faint transition-all duration-200 ease-gallery-in-out " +
    "peer-focus:top-1 peer-focus:scale-[0.78] peer-focus:text-gold-ink " +
    "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:scale-[0.78] peer-[:not(:placeholder-shown)]:text-text-faint";

  if (multiline) {
    const { onChange, ...textareaRest } = rest as Omit<FloatingTextareaProps, "label" | "required" | "multiline" | "className">;

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
      onChange?.(e);
    }

    return (
      <div className="relative">
        <textarea
          id={id}
          placeholder=" "
          required={required}
          rows={1}
          onChange={handleChange}
          className={`${fieldClasses} min-h-[3.25rem] overflow-hidden transition-[height,border-color] ${className ?? ""}`}
          {...textareaRest}
        />
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span className="text-gold-ink"> *</span>}
        </label>
      </div>
    );
  }

  const inputRest = rest as Omit<FloatingInputProps, "label" | "required" | "multiline" | "className">;

  return (
    <div className="relative">
      <input id={id} placeholder=" " required={required} className={`${fieldClasses} ${className ?? ""}`} {...inputRest} />
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-gold-ink"> *</span>}
      </label>
    </div>
  );
}
