// 轻量级 Markdown 转纯文本（本页本地副本，主包已移除 utils/markdown.js 以通过代码质量检查）
function stripMarkdown(md) {
  if (!md) return '';
  let text = md;
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/^#{1,6}\s*/gm, '');
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*>+\s?/gm, '');
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');
  text = text.replace(/!\[([^\]]*)]\([^)]+\)/g, '$1');
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}
module.exports = { stripMarkdown };
