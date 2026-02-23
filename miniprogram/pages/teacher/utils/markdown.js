// 轻量级 Markdown 转纯文本工具（教师分包内，减少主包体积）
// 使用位置：teacher-materials、teacher-generate-material

function stripMarkdown(md) {
  if (!md) return '';

  let text = md;

  // 去掉代码块 ``` ```（多行）
  text = text.replace(/```[\s\S]*?```/g, '');

  // 行首标题 #, ##, ### 等
  text = text.replace(/^#{1,6}\s*/gm, '');

  // 列表符号 -, *, + 行首
  text = text.replace(/^\s*[-*+]\s+/gm, '');

  // 引用行 >
  text = text.replace(/^\s*>+\s?/gm, '');

  // 粗体/斜体 **text**、__text__、*text*、_text_
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');

  // 链接 [text](url) -> text
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');

  // 图片 ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)]\([^)]+\)/g, '$1');

  // 水平线 --- *** ___
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');

  // 多余空行压缩
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

module.exports = {
  stripMarkdown
};
