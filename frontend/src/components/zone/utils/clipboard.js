// ✅ clipboard.js
// 주소 복사 유틸 (주석 포함)

export async function copyToClipboard(text) {
  if (!text) return false;

  try {
    // 최신 브라우저(권장)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // fallback: execCommand (구형 브라우저)
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}
