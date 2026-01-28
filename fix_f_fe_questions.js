// 修复 f/fe结尾 题目的脚本
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '去重后的题库.json');

console.log('📖 读取文件...');
const data = fs.readFileSync(filePath, 'utf8');
const lines = data.split('\n').filter(l => l.trim());

let modified = 0;
const modifiedIds = [];

const result = lines.map((line, index) => {
  if (!line.trim()) return line;
  
  try {
    const obj = JSON.parse(line);
    const text = (obj.text || '').toLowerCase();
    const analysis = (obj.analysis || '').toLowerCase();
    
    // 检查是否是关于 f/fe 结尾的题目
    const ffeKeywords = [
      'leaf', 'leaves', 'knife', 'knives', 'life', 'lives', 
      'wife', 'wives', 'wolf', 'wolves', 'loaf', 'loaves',
      'chief', 'chiefs', 'shelf', 'shelves', 'proof', 'proofs',
      'gulf', 'gulfs', 'half', 'halves', 'roof', 'roofs',
      'thief', 'thieves', 'handkerchief', 'handkerchiefs',
      'scarf', 'scarves', 'calf', 'calves'
    ];
    
    const hasFfeContent = 
      ffeKeywords.some(keyword => text.includes(keyword)) ||
      analysis.includes('f/fe') ||
      analysis.includes('f或fe') ||
      analysis.includes('以f') ||
      analysis.includes('以fe') ||
      analysis.includes('f变为v') ||
      analysis.includes('fe变为v');
    
    // 情况1：有 grammarPoint="f/fe结尾"，但缺少 category
    if (obj.grammarPoint === 'f/fe结尾') {
      if (!obj.category) {
        obj.category = '名词综合';
        modified++;
        modifiedIds.push({ id: obj._id, change: '添加 category="名词综合"' });
        console.log(`  ✅ 第${index + 1}行: ${obj._id} - 添加 category="名词综合"`);
      }
    }
    // 情况2：有 category="名词综合" 或 "名词复数书写综合"，且内容是关于 f/fe 的，但缺少 grammarPoint
    else if (hasFfeContent && (obj.category === '名词综合' || obj.category === '名词复数书写综合')) {
      if (!obj.grammarPoint) {
        obj.grammarPoint = 'f/fe结尾';
        modified++;
        modifiedIds.push({ id: obj._id, change: '添加 grammarPoint="f/fe结尾"' });
        console.log(`  ✅ 第${index + 1}行: ${obj._id} - 添加 grammarPoint="f/fe结尾"`);
      }
    }
    
    return JSON.stringify(obj);
  } catch (e) {
    console.warn(`  ⚠️ 第${index + 1}行解析失败:`, e.message);
    return line;
  }
});

console.log(`\n📝 写入文件...`);
fs.writeFileSync(filePath, result.join('\n'), 'utf8');

console.log(`\n✅ 修改完成！`);
console.log(`   共修改 ${modified} 道题目\n`);

if (modifiedIds.length > 0) {
  console.log('📋 修改详情:');
  modifiedIds.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ${item.id}: ${item.change}`);
  });
}
