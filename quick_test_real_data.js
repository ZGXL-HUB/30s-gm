// 快速测试真实数据集成功能
console.log('=== 快速测试真实数据集成 ===');

// 测试函数：验证真实数据集成是否工作
function quickTestRealData() {
  console.log('\n📋 测试步骤:');
  console.log('1. 发布一个新作业（选择具体的语法点）');
  console.log('2. 进入配套材料界面');
  console.log('3. 点击"原题+变式材料PPT"按钮');
  console.log('4. 检查生成的内容是否包含真实题目');
  console.log('5. 点击"作业原题学案"按钮');
  console.log('6. 检查学案内容是否基于真实题目');
  
  console.log('\n✅ 预期结果:');
  console.log('- 生成的内容包含真实的语法题目');
  console.log('- 题目有完整的选项、答案和解析');
  console.log('- 原题和变式题目有明显区别');
  console.log('- 不再显示"模板内容"');
  
  console.log('\n🔍 检查要点:');
  console.log('- 题目内容是否来自题库（不是"请根据XX语法规则选择"）');
  console.log('- 选项是否有具体内容（不是"选项A、选项B"）');
  console.log('- 解析是否详细（不是"这是正确答案的详细解析"）');
  console.log('- 变式题是否与原题有区别');
  
  console.log('\n📊 控制台日志:');
  console.log('- 查找"获取到的真实题目"日志');
  console.log('- 查找"学案生成获取到的真实题目"日志');
  console.log('- 检查是否有题库加载相关的日志');
  
  console.log('\n🎯 成功标志:');
  console.log('- 看到真实的语法题目内容');
  console.log('- 原题和变式题目不同');
  console.log('- 控制台显示成功获取真实题目的日志');
}

// 测试函数：检查题库数据
function checkQuestionBankData() {
  console.log('\n📚 题库数据检查:');
  
  try {
    // 检查选择题题库
    const choiceQuestions = require('../../../语法选择题题库/语法选择题题库.json');
    if (choiceQuestions && choiceQuestions.questions) {
      console.log(`✅ 选择题题库加载成功，题目数量: ${choiceQuestions.questions.length}`);
      
      // 显示几个示例题目
      console.log('\n📖 选择题示例:');
      choiceQuestions.questions.slice(0, 2).forEach((q, index) => {
        console.log(`${index + 1}. ${q.grammarPoint}: ${q.question}`);
        console.log(`   选项: ${q.options.map(opt => `${opt.label}. ${opt.text}`).join(', ')}`);
        console.log(`   答案: ${q.correctAnswer}`);
      });
    } else {
      console.log('❌ 选择题题库加载失败');
    }
  } catch (error) {
    console.log('❌ 选择题题库访问失败:', error.message);
  }
  
  try {
    // 检查填空题题库
    const writingQuestions = require('./miniprogram/writing_exercise_questions.js').writingExerciseQuestions;
    if (writingQuestions) {
      const totalQuestions = Object.values(writingQuestions).reduce((sum, arr) => sum + arr.length, 0);
      console.log(`✅ 填空题题库加载成功，题目数量: ${totalQuestions}`);
      
      // 显示几个示例题目
      console.log('\n📝 填空题示例:');
      let count = 0;
      for (const [category, questions] of Object.entries(writingQuestions)) {
        if (count >= 2) break;
        const question = questions[0];
        console.log(`${count + 1}. ${question.category}: ${question.question}`);
        console.log(`   答案: ${question.answer}`);
        count++;
      }
    } else {
      console.log('❌ 填空题题库加载失败');
    }
  } catch (error) {
    console.log('❌ 填空题题库访问失败:', error.message);
  }
}

// 测试函数：模拟作业数据
function simulateAssignmentData() {
  console.log('\n🎯 模拟作业数据测试:');
  
  const mockAssignment = {
    _id: 'test_homework_123',
    title: '介词综合练习',
    type: 'topic',
    selectedItems: [
      { name: '介词综合', questionCount: 3 },
      { name: '固定搭配', questionCount: 2 }
    ],
    selectedGrammarPoints: ['介词综合', '固定搭配']
  };
  
  console.log('模拟作业数据:', mockAssignment);
  
  // 模拟题目匹配逻辑
  try {
    const choiceQuestions = require('../../../语法选择题题库/语法选择题题库.json');
    if (choiceQuestions && choiceQuestions.questions) {
      mockAssignment.selectedItems.forEach(item => {
        const matchingQuestions = choiceQuestions.questions.filter(q => 
          q.grammarPoint === item.name || 
          q.category && q.category.includes(item.name) ||
          item.name.includes(q.grammarPoint)
        );
        
        console.log(`语法点 "${item.name}" 匹配到 ${matchingQuestions.length} 个题目`);
        if (matchingQuestions.length > 0) {
          console.log(`示例题目: ${matchingQuestions[0].question}`);
        }
      });
    }
  } catch (error) {
    console.log('题目匹配测试失败:', error.message);
  }
}

// 主测试函数
function runQuickTest() {
  console.log('🚀 开始快速测试...\n');
  
  quickTestRealData();
  checkQuestionBankData();
  simulateAssignmentData();
  
  console.log('\n🎉 快速测试完成！');
  console.log('现在可以按照测试步骤验证真实数据集成功能');
}

// 运行测试
runQuickTest();

// 如果在小程序环境中运行
if (typeof wx !== 'undefined') {
  console.log('\n💡 提示: 在微信开发者工具中，请按照上述步骤进行实际测试');
} else {
  console.log('\n💡 提示: 请将此脚本复制到微信开发者工具控制台中运行');
}
