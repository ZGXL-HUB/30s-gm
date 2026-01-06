/**
 * 上传初中模块题目到云数据库
 * 在微信开发者工具的控制台运行此脚本
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开项目
 * 2. 打开控制台（Console）
 * 3. 复制此文件内容到控制台运行
 * 4. 或者：在控制台输入 uploadQuestions() 并回车
 */

// 读取本地JSON文件并上传到云数据库
async function uploadQuestions() {
  try {
    console.log('🔄 开始上传初中模块题目到云数据库...');
    
    // 检查云开发环境
    if (!wx || !wx.cloud || !wx.cloud.database) {
      console.error('❌ 云开发环境不可用，请确保已初始化云开发');
      return { success: false, message: '云开发环境不可用' };
    }
    
    // 读取本地JSON文件（需要先通过其他方式获取JSON内容）
    // 方法1：如果JSON文件在项目中，可以通过require或fetch获取
    // 方法2：直接在控制台粘贴JSON数据
    
    console.log('📝 请先运行以下命令获取JSON数据：');
    console.log('   1. 在Node.js环境中运行: node generate_middle_school_questions.js');
    console.log('   2. 打开生成的 middle_school_questions.json 文件');
    console.log('   3. 复制JSON内容，然后在控制台运行: uploadQuestionsFromJSON(JSON数据)');
    
    return { success: false, message: '请使用 uploadQuestionsFromJSON 函数上传' };
    
  } catch (error) {
    console.error('❌ 上传失败:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 从JSON数据上传题目
 * @param {Array} questions - 题目数组
 */
async function uploadQuestionsFromJSON(questions) {
  try {
    console.log('🔄 开始上传题目到云数据库...');
    console.log(`📊 共 ${questions.length} 道题目`);
    
    if (!wx || !wx.cloud || !wx.cloud.database) {
      console.error('❌ 云开发环境不可用');
      return { success: false, message: '云开发环境不可用' };
    }
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.error('❌ 题目数据无效');
      return { success: false, message: '题目数据无效' };
    }
    
    const db = wx.cloud.database();
    const collection = db.collection('questions');
    
    let successCount = 0;
    let failCount = 0;
    let duplicateCount = 0;
    const batchSize = 20; // 每批20题
    
    // 分批上传
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(questions.length / batchSize);
      
      console.log(`📦 上传第 ${batchNum}/${totalBatches} 批（${i + 1}-${Math.min(i + batchSize, questions.length)}）...`);
      
      for (const question of batch) {
        try {
          // 检查必填字段
          if (!question.text || !question.answer || !question.grammarPoint) {
            console.warn(`⚠️ 跳过无效题目: ${question._id || 'unknown'}`);
            failCount++;
            continue;
          }
          
          // 确保字段完整
          const questionData = {
            text: question.text,
            answer: question.answer,
            grammarPoint: question.grammarPoint,
            category: question.category || question.grammarPoint,
            type: question.type || 'choice',
            options: question.options || [],
            analysis: question.analysis || '',
            difficulty: question.difficulty || 'medium',
            province: question.province || '云南',
            year: question.year || 2025,
            source: question.source || '题库',
            schoolLevel: question.schoolLevel || 'middle',
            examFrequency: question.examFrequency || '⭐',
            examYears: question.examYears || [],
            _id: question._id // 保留原ID（如果云数据库允许）
          };
          
          // 尝试添加题目
          try {
            await collection.add({
              data: questionData
            });
            successCount++;
          } catch (addError) {
            // 如果是因为ID冲突，尝试不指定ID
            if (addError.errMsg && addError.errMsg.includes('duplicate')) {
              console.log(`   ⚠️ 题目已存在，跳过: ${question.grammarPoint}`);
              duplicateCount++;
            } else {
              // 尝试不指定ID重新添加
              const { _id, ...dataWithoutId } = questionData;
              await collection.add({
                data: dataWithoutId
              });
              successCount++;
            }
          }
          
        } catch (error) {
          console.error(`   ❌ 添加失败: ${question.grammarPoint}`, error.message);
          failCount++;
        }
      }
      
      // 延迟避免频率限制
      if (i + batchSize < questions.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n📊 上传统计:`);
    console.log(`   ✅ 成功: ${successCount} 题`);
    console.log(`   ⚠️ 重复: ${duplicateCount} 题`);
    console.log(`   ❌ 失败: ${failCount} 题`);
    console.log(`   📈 总计: ${questions.length} 题`);
    
    return {
      success: true,
      uploaded: successCount,
      duplicates: duplicateCount,
      failed: failCount,
      total: questions.length
    };
    
  } catch (error) {
    console.error('❌ 上传失败:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 从云函数上传（推荐方式，更稳定）
 */
async function uploadViaCloudFunction(questions) {
  try {
    console.log('🔄 通过云函数上传题目...');
    
    if (!wx || !wx.cloud) {
      console.error('❌ 云开发环境不可用');
      return { success: false, message: '云开发环境不可用' };
    }
    
    // 调用云函数上传
    const result = await wx.cloud.callFunction({
      name: 'uploadQuestions',
      data: {
        questions: questions,
        schoolLevel: 'middle'
      }
    });
    
    console.log('📊 上传结果:', result.result);
    return result.result;
    
  } catch (error) {
    console.error('❌ 云函数上传失败:', error);
    // 如果云函数不存在，回退到直接上传
    console.log('⚠️ 云函数不存在，尝试直接上传...');
    return await uploadQuestionsFromJSON(questions);
  }
}

/**
 * 验证上传结果
 */
async function verifyUpload() {
  try {
    console.log('🔍 验证上传结果...');
    
    const db = wx.cloud.database();
    const result = await db.collection('questions')
      .where({
        schoolLevel: 'middle',
        source: '题库'
      })
      .count();
    
    console.log(`✅ 云数据库中初中模块题库题目数量: ${result.total}`);
    return result.total;
    
  } catch (error) {
    console.error('❌ 验证失败:', error);
    return 0;
  }
}

// 导出函数供控制台使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    uploadQuestions,
    uploadQuestionsFromJSON,
    uploadViaCloudFunction,
    verifyUpload
  };
}

// 在控制台显示使用说明
console.log(`
📚 初中模块题目上传工具

使用方法：
1. 运行生成脚本: node generate_middle_school_questions.js
2. 打开生成的 middle_school_questions.json 文件
3. 复制JSON数组内容
4. 在控制台运行: uploadQuestionsFromJSON(粘贴的JSON数据)

或者：
- 使用云函数上传: uploadViaCloudFunction(JSON数据)
- 验证上传结果: verifyUpload()
`);

