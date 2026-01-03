/**
 * JSON数据验证和转义修复工具
 * 用于检查题目数据中的转义问题并提供修复建议
 */

// 导入fs模块用于文件操作
const fs = require('fs');
const path = require('path');

/**
 * 验证JSON数据格式
 */
function validateJsonData(data) {
  const issues = [];
  let validCount = 0;
  let invalidCount = 0;

  if (!Array.isArray(data)) {
    return {
      success: false,
      error: '数据不是数组格式',
      issues: [],
      stats: { valid: 0, invalid: 1, total: 1 }
    };
  }

  data.forEach((question, index) => {
    const questionIssues = [];

    // 检查必需字段
    const requiredFields = ['text', 'answer', 'type', 'category'];
    requiredFields.forEach(field => {
      if (!question.hasOwnProperty(field)) {
        questionIssues.push(`缺少必需字段: ${field}`);
      }
    });

    // 检查text字段的转义问题
    if (question.text) {
      // 检查未转义的双引号（在字符串内部的双引号）
      const textStr = JSON.stringify(question.text);
      if (textStr.includes('\\"')) {
        // 已经有转义，检查是否正确
      } else if (question.text.includes('"') && !textStr.includes('\\"')) {
        // 字符串包含双引号但没有转义
        questionIssues.push('text字段包含未转义的双引号');
      }

      // 检查其他可能的问题字符
      if (question.text.includes('\\') && !question.text.includes('\\\\')) {
        questionIssues.push('text字段包含未转义的反斜杠');
      }
    }

    // 检查answer字段
    if (question.answer) {
      if (question.type === 'choice') {
        if (!['A', 'B', 'C', 'D'].includes(question.answer)) {
          questionIssues.push(`choice类型答案无效: ${question.answer} (应为A/B/C/D)`);
        }
      } else if (question.type === 'fill_blank') {
        if (typeof question.answer !== 'string' || question.answer.trim() === '') {
          questionIssues.push(`fill_blank类型答案无效: ${question.answer}`);
        }
      }
    }

    // 检查analysis字段
    if (question.analysis) {
      const analysisStr = JSON.stringify(question.analysis);
      if (question.analysis.includes('"') && !analysisStr.includes('\\"')) {
        questionIssues.push('analysis字段包含未转义的双引号');
      }
    }

    if (questionIssues.length > 0) {
      issues.push({
        index: index + 1,
        question: question.text ? question.text.substring(0, 50) + '...' : 'N/A',
        issues: questionIssues
      });
      invalidCount++;
    } else {
      validCount++;
    }
  });

  return {
    success: issues.length === 0,
    issues: issues,
    stats: {
      valid: validCount,
      invalid: invalidCount,
      total: data.length
    }
  };
}

/**
 * 修复JSON数据中的转义问题
 */
function fixJsonEscaping(data) {
  return data.map(question => {
    const fixed = { ...question };

    // 修复text字段
    if (fixed.text) {
      // 转义双引号，但保持字符串结构
      fixed.text = fixed.text.replace(/"/g, '\\"');
      // 转义反斜杠
      fixed.text = fixed.text.replace(/\\/g, '\\\\');
      // 转义换行符
      fixed.text = fixed.text.replace(/\n/g, '\\n');
      // 转义制表符
      fixed.text = fixed.text.replace(/\t/g, '\\t');
    }

    // 修复analysis字段
    if (fixed.analysis) {
      fixed.analysis = fixed.analysis.replace(/"/g, '\\"');
      fixed.analysis = fixed.analysis.replace(/\\/g, '\\\\');
      fixed.analysis = fixed.analysis.replace(/\n/g, '\\n');
      fixed.analysis = fixed.analysis.replace(/\t/g, '\\t');
    }

    return fixed;
  });
}

/**
 * 生成修复报告
 */
function generateFixReport(validationResult, fixedData) {
  let report = '='.repeat(50) + '\n';
  report += 'JSON数据验证和修复报告\n';
  report += '='.repeat(50) + '\n\n';

  report += `数据统计:\n`;
  report += `- 总题目数: ${validationResult.stats.total}\n`;
  report += `- 有效题目: ${validationResult.stats.valid}\n`;
  report += `- 无效题目: ${validationResult.stats.invalid}\n\n`;

  if (validationResult.issues.length > 0) {
    report += `发现的问题:\n`;
    validationResult.issues.forEach(issue => {
      report += `\n题目 ${issue.index}: ${issue.question}\n`;
      issue.issues.forEach(problem => {
        report += `  - ${problem}\n`;
      });
    });
    report += '\n';
  } else {
    report += '✅ 所有题目验证通过，无需修复\n';
  }

  report += '\n修复建议:\n';
  if (validationResult.issues.some(i => i.issues.some(p => p.includes('双引号')))) {
    report += '- 已自动修复双引号转义问题\n';
  }
  if (validationResult.issues.some(i => i.issues.some(p => p.includes('反斜杠')))) {
    report += '- 已自动修复反斜杠转义问题\n';
  }
  if (validationResult.issues.some(i => i.issues.some(p => p.includes('答案无效')))) {
    report += '- 请检查答案格式是否符合题目类型要求\n';
  }

  return report;
}

// 如果直接运行此脚本
if (require.main === module) {
  // 示例用法
  const sampleData = [
    {
      "text": "____ beautiful painting! The colors are so bright and full of life.",
      "answer": "C",
      "grammarPoint": "感叹句",
      "category": "特殊句式",
      "type": "choice",
      "analysis": "本题考查感叹句的结构。中心词是名词短语'beautiful painting'，其中painting是可数名词单数，beautiful以辅音音素开头，因此感叹句结构为'What a + adj. + 可数名词单数！'。",
      "difficulty": "medium",
      "province": "云南",
      "year": 2024,
      "source": "变式题"
    },
    {
      "text": "My sister ________ (visit) the zoo with her friends yesterday afternoon.",
      "answer": "visited",
      "grammarPoint": "一般过去时",
      "category": "动词时态",
      "type": "fill_blank",
      "analysis": "本题考查一般过去时的用法。句中有明确表示过去的时间状语'yesterday afternoon'（昨天下午），因此谓语动词需用过去式。",
      "difficulty": "easy",
      "province": "云南",
      "year": 2025,
      "source": "变式题"
    }
  ];

  console.log('🔍 开始验证JSON数据...\n');

  const validation = validateJsonData(sampleData);
  const fixedData = fixJsonEscaping(sampleData);
  const report = generateFixReport(validation, fixedData);

  console.log(report);

  // 保存修复后的数据
  const outputPath = path.join(__dirname, 'fixed_questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2), 'utf8');
  console.log(`📄 修复后的数据已保存到: ${outputPath}`);
}

module.exports = {
  validateJsonData,
  fixJsonEscaping,
  generateFixReport
};
