type AppendUmamiScriptParams = {
  src: string;
  attributes: Record<string, string>;
  onLoad?: () => void;
};

/** Adds a script once, however often consent is reported. */
export function appendUmamiScript({
  src,
  attributes,
  onLoad,
}: AppendUmamiScriptParams) {
  if (document.querySelector(`script[src="${src}"]`)) {
    return;
  }

  const script = document.createElement("script");

  script.src = src;
  // Injected scripts are async by default; this keeps them in order, the
  // tracker before the recorder that reads its session.
  script.async = false;

  Object.entries(attributes).forEach(([name, value]) => {
    script.setAttribute(name, value);
  });

  if (onLoad) {
    script.addEventListener("load", onLoad);
  }

  document.head.append(script);
}
