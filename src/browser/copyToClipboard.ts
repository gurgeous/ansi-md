// Browser clipboard helper with a textarea fallback for insecure contexts.
// Code widgets use this so DOM-only behavior stays out of shared server code.

// Copy text into the clipboard, falling back to execCommand when needed.
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through for dev URLs without secure clipboard access.
    }
  }

  const $textarea = document.createElement("textarea");
  $textarea.className = "clipboard-fallback";
  $textarea.value = text;
  $textarea.setAttribute("readonly", "");
  document.body.append($textarea);

  $textarea.select();
  execCommand("copy");
  $textarea.remove();
}

const execCommand = (document as unknown as { execCommand(command: string): boolean }).execCommand.bind(document);
