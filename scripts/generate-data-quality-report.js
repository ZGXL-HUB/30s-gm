const fs = require('fs');
const path = require('path');

class DataQualityReportGenerator {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      summary: {},
      details: {
        duplicates: [],
        missingFields: [],
        invalidData: [],
        statistics: {}
      }
    };
  }

  // 分析数据文件
  analyzeDataFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let data;
      
      // 处理JavaScript文件
      if (filePath.endsWith('.js')) {
        // 提取JavaScript对象
        const match = content.match(/const\s+\w+\s*=\s*({[\s\S]*});/);
        if (match) {
          try {
            // 使用eval来解析JavaScript对象（在生产环境中应该使用更安全的方法）
            const jsCode = match[1];
            data = eval(`(${jsCode})`);
          } catch (evalError) {
            console.error(`Error evaluating JavaScript in ${filePath}:`, evalError.message);
            return null;
          }
        } else {
          console.error(`No valid JavaScript object found in ${filePath}`);
          return null;
        }
      } else {
        // 处理JSON文件
        data = JSON.parse(content);
      }
      
      const analysis = {
        file: path.basename(filePath),
        totalQuestions: 0,
        categories: new Set(),
        duplicates: [],
        missingFields: [],
        invalidData: []
      };

      // 处理不同的数据结构
      if (Array.isArray(data)) {
        analysis.totalQuestions = data.length;
        data.forEach((question, index) => {
          this.analyzeQuestion(question, index, analysis);
        });
      } else if (data.questions && Array.isArray(data.questions)) {
        analysis.totalQuestions = data.questions.length;
        data.questions.forEach((question, index) => {
          this.analyzeQuestion(question, index, analysis);
        });
      } else if (typeof data === 'object') {
        // 处理按分类组织的对象
        let questionIndex = 0;
        Object.keys(data).forEach(category => {
          if (Array.isArray(data[category])) {
            analysis.totalQuestions += data[category].length;
            data[category].forEach((question, index) => {
              this.analyzeQuestion(question, questionIndex, analysis);
              questionIndex++;
            });
          }
        });
      }

      analysis.categories = Array.from(analysis.categories);
      return analysis;
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
      return null;
    }
  }

  // 分析单个问题
  analyzeQuestion(question, index, analysis) {
    // 检查必需字段
    const requiredFields = ['text', 'answer', 'analysis', 'category'];
    const missingFields = requiredFields.filter(field => !question[field]);
    
    if (missingFields.length > 0) {
      analysis.missingFields.push({
        index,
        question: question.text || `Question ${index}`,
        missingFields
      });
    }

    // 检查重复
    if (question.text) {
      const existingDuplicate = analysis.duplicates.find(d => d.text === question.text);
      if (existingDuplicate) {
        existingDuplicate.occurrences.push(index);
      } else {
        // 检查是否在其他地方有重复
        // 这里简化处理，实际可能需要更复杂的重复检测
      }
    }

    // 收集分类信息
    if (question.category) {
      analysis.categories.add(question.category);
    }

    // 检查数据有效性
    if (question.text && question.text.length < 10) {
      analysis.invalidData.push({
        index,
        type: 'short_text',
        question: question.text,
        issue: 'Text too short (less than 10 characters)'
      });
    }

    if (question.answer && question.answer.length === 0) {
      analysis.invalidData.push({
        index,
        type: 'empty_answer',
        question: question.text || `Question ${index}`,
        issue: 'Empty answer field'
      });
    }
  }

  // 生成报告
  generateReport() {
    console.log('🔍 开始生成数据质量报告...');

    const dataFiles = [
      'miniprogram/data/intermediate_questions.js',
      'data-quality-report.json',
      'data-quality-report-v2.json'
    ];

    let totalQuestions = 0;
    let totalCategories = new Set();
    let allDuplicates = [];
    let allMissingFields = [];
    let allInvalidData = [];

    dataFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        console.log(`📊 分析文件: ${filePath}`);
        const analysis = this.analyzeDataFile(filePath);
        
        if (analysis) {
          totalQuestions += analysis.totalQuestions;
          analysis.categories.forEach(cat => totalCategories.add(cat));
          allDuplicates.push(...analysis.duplicates);
          allMissingFields.push(...analysis.missingFields);
          allInvalidData.push(...analysis.invalidData);
        }
      }
    });

    // 生成统计信息
    this.report.summary = {
      totalQuestions,
      totalCategories: totalCategories.size,
      totalDuplicates: allDuplicates.length,
      totalMissingFields: allMissingFields.length,
      totalInvalidData: allInvalidData.length,
      dataQualityScore: this.calculateQualityScore(totalQuestions, allDuplicates.length, allMissingFields.length, allInvalidData.length)
    };

    this.report.details = {
      duplicates: allDuplicates,
      missingFields: allMissingFields,
      invalidData: allInvalidData,
      statistics: {
        categories: Array.from(totalCategories),
        filesAnalyzed: dataFiles.filter(file => fs.existsSync(file))
      }
    };

    // 保存报告
    const reportPath = `data-quality-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    console.log('✅ 数据质量报告已生成:', reportPath);
    this.printSummary();
    
    return this.report;
  }

  // 计算质量分数
  calculateQualityScore(total, duplicates, missing, invalid) {
    if (total === 0) return 0;
    
    const maxScore = 100;
    const duplicatePenalty = (duplicates / total) * 30;
    const missingPenalty = (missing / total) * 40;
    const invalidPenalty = (invalid / total) * 30;
    
    const score = Math.max(0, maxScore - duplicatePenalty - missingPenalty - invalidPenalty);
    return Math.round(score * 100) / 100;
  }

  // 打印摘要
  printSummary() {
    const summary = this.report.summary;
    
    console.log('\n📈 数据质量报告摘要');
    console.log('='.repeat(50));
    console.log(`📊 总题目数: ${summary.totalQuestions}`);
    console.log(`🏷️  分类数量: ${summary.totalCategories}`);
    console.log(`🔄 重复题目: ${summary.totalDuplicates}`);
    console.log(`❌ 缺失字段: ${summary.totalMissingFields}`);
    console.log(`⚠️  无效数据: ${summary.totalInvalidData}`);
    console.log(`⭐ 质量分数: ${summary.dataQualityScore}/100`);
    console.log('='.repeat(50));

    if (summary.dataQualityScore >= 90) {
      console.log('🎉 数据质量优秀！');
    } else if (summary.dataQualityScore >= 70) {
      console.log('👍 数据质量良好，有改进空间');
    } else if (summary.dataQualityScore >= 50) {
      console.log('⚠️  数据质量一般，需要改进');
    } else {
      console.log('🚨 数据质量较差，需要重点关注');
    }
  }
}

// 主函数
function main() {
  const generator = new DataQualityReportGenerator();
  const report = generator.generateReport();
  
  // 如果命令行参数包含 --report，输出详细报告
  if (process.argv.includes('--report')) {
    console.log('\n📋 详细报告:');
    console.log(JSON.stringify(report, null, 2));
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = DataQualityReportGenerator; 