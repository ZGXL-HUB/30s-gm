// 统一学案生成流程页面
Page({
  data: {
    // 基础数据
    selectedQuestions: [], // 选中的原题
    assignmentData: null, // 作业数据
    materialInfo: null, // 材料信息
    
    // 变式题选择
    variantCount: 0, // 变式题数量 (0-3)
    
    // 预览相关
    previewContent: '', // 预览内容
    showPreview: false, // 是否显示预览
    previewType: 'student', // 预览类型: 'student' | 'teacher'
    
    // 生成状态
    isGenerating: false, // 是否正在生成
    generatedContent: '', // 生成的内容
    
    // 分享相关
    shareInfo: null, // 分享信息
  },

  onLoad(options) {
    // 从参数获取材料信息
    if (options.materialId) {
      this.loadMaterialData(options.materialId);
    }
    
    // 从参数获取作业数据
    if (options.assignmentId) {
      this.loadAssignmentData(options.assignmentId);
    }
    
    // 从布置作业页面传递的作业数据
    if (options.data) {
      try {
        const assignmentData = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          assignmentData: assignmentData,
          selectedQuestions: assignmentData.questions || []
        });
        console.log('接收到作业数据:', assignmentData);
      } catch (error) {
        console.error('解析作业数据失败:', error);
        wx.showToast({
          title: '数据加载失败',
          icon: 'error'
        });
      }
    }
    
    // 兼容旧参数名
    if (options.assignmentData) {
      try {
        const assignmentData = JSON.parse(decodeURIComponent(options.assignmentData));
        this.setData({
          assignmentData: assignmentData,
          selectedQuestions: assignmentData.questions || []
        });
        console.log('接收到作业数据（旧参数）:', assignmentData);
      } catch (error) {
        console.error('解析作业数据失败:', error);
      }
    }
    
    // 接收变式题数量
    if (options.variantCount) {
      this.setData({
        variantCount: parseInt(options.variantCount)
      });
    }
    
    // 直接进入预览模式
    this.setData({
      showPreview: true
    });
    
    // 初始化预览
    this.generatePreview();
  },

  // 加载材料数据
  async loadMaterialData(materialId) {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const materials = wx.getStorageSync(`materials_${teacherId}`) || [];
      const material = materials.find(m => m.id === materialId);
      
      if (material) {
        this.setData({
          materialInfo: material,
          assignmentData: await this.getAssignmentData(material.assignmentId)
        });
        this.loadQuestions();
      }
    } catch (error) {
      console.error('加载材料数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  },

  // 加载作业数据
  async loadAssignmentData(assignmentId) {
    try {
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      const homeworks = wx.getStorageSync(`homeworks_${teacherId}`) || [];
      const assignments = wx.getStorageSync(`assignments_${teacherId}`) || [];
      const allAssignments = [...homeworks, ...assignments];
      const assignment = allAssignments.find(a => (a._id || a.id) === assignmentId);
      
      if (assignment) {
        this.setData({
          assignmentData: assignment
        });
        this.loadQuestions();
      }
    } catch (error) {
      console.error('加载作业数据失败:', error);
    }
  },

  // 加载题目数据
  loadQuestions() {
    const { assignmentData } = this.data;
    if (assignmentData && assignmentData.questions) {
      this.setData({
        selectedQuestions: assignmentData.questions
      });
    }
  },

  // 生成智能占位符题目
  generateSmartPlaceholders(grammarPoint, count, originalQuestions) {
    const placeholders = [];

    // 如果有原始题目作为基础
    if (originalQuestions.length > 0) {
      for (let i = 0; i < count; i++) {
        const baseQuestion = originalQuestions[i % originalQuestions.length];
        const placeholder = {
          ...baseQuestion,
          id: `${baseQuestion.id}_placeholder_${i}`,
          text: `${baseQuestion.text} (智能占位符 - ${grammarPoint})`,
          isPlaceholder: true,
          grammarPoint: grammarPoint
        };
        placeholders.push(placeholder);
      }
    } else {
      // 如果没有任何原始题目，生成标准格式的占位符题目
      for (let i = 0; i < count; i++) {
        const placeholder = this.createStandardPlaceholder(grammarPoint, i);
        placeholders.push(placeholder);
      }
    }

    return placeholders;
  },

  // 创建标准格式的占位符题目
  createStandardPlaceholder(grammarPoint, index) {
    const templates = {
      'must/need': {
        text: `You ____ finish your homework on time. A. can B. must C. may D. need (Placeholder for ${grammarPoint})`,
        answer: 'B',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      },
      '时间介词': {
        text: `We have classes ____ Monday. A. at B. on C. in D. for (Placeholder for ${grammarPoint})`,
        answer: 'B',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      },
      '感叹句': {
        text: `____ beautiful the scenery is! A. What B. How C. What a D. What an (Placeholder for ${grammarPoint})`,
        answer: 'C',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      },
      '疑问句': {
        text: `____ is your name? A. What B. How C. Why D. When (Placeholder for ${grammarPoint})`,
        answer: 'A',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      },
      'There be句型': {
        text: `____ a book on the table. A. There is B. There are C. There has D. There have (Placeholder for ${grammarPoint})`,
        answer: 'A',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      },
      '关系代词': {
        text: `This is the man ____ helped me. A. who B. whom C. whose D. which (Placeholder for ${grammarPoint})`,
        answer: 'A',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      },
      '祈使句': {
        text: `____ the window, please. A. Open B. Opens C. Opened D. Opening (Placeholder for ${grammarPoint})`,
        answer: 'A',
        analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
      }
    };

    const template = templates[grammarPoint] || {
      text: `This is a placeholder question for ${grammarPoint}. Please replace with actual content.`,
      answer: 'A',
      analysis: `This is a placeholder question for ${grammarPoint}. In actual teaching, replace with real grammar exercises.`
    };

    return {
      id: `placeholder_${grammarPoint}_${index}`,
      text: template.text,
      answer: template.answer,
      grammarPoint: grammarPoint,
      category: this.getCategoryForGrammarPoint(grammarPoint),
      type: 'choice',
      analysis: template.analysis,
      difficulty: 'easy',
      province: '云南',
      year: 2025,
      source: '系统占位符',
      isPlaceholder: true
    };
  },

  // 根据语法点获取分类
  getCategoryForGrammarPoint(grammarPoint) {
    const categoryMap = {
      'must/need': '情态动词',
      '时间介词': '介词',
      '感叹句': '特殊句式',
      '疑问句': '特殊句式',
      'There be句型': '特殊句式',
      '关系代词': '代词',
      '祈使句': '特殊句式'
    };
    return categoryMap[grammarPoint] || '其他';
  },

  // 生成专题20题的题目（新实现）
  // 输入：专题名称（如"连词"）、目标题数（默认20）、学段（'high' 或 'middle'）
  // 输出：不重复的题目数组
  async generateQuestionsByTopic(topicName, targetCount = 20, schoolLevel = 'high') {
    console.log(`📚 开始生成专题题目: "${topicName}", 目标题数: ${targetCount}, 学段: ${schoolLevel}`);
    
    try {
      // 加载 cloudDataLoader
      const cloudDataLoader = require('../../../utils/cloudDataLoader.js');
      
      // 步骤1: 获取子知识点列表
      const topicMapping = cloudDataLoader.getTopicToSubPointsMapping(schoolLevel);
      const subPoints = topicMapping[topicName] || [];
      
      if (subPoints.length === 0) {
        console.warn(`⚠️ 专题 "${topicName}" 没有找到子知识点映射`);
        return [];
      }
      
      console.log(`📋 专题 "${topicName}" 的子知识点列表 (${subPoints.length}个):`, subPoints);
      
      // 步骤2: 初始化分配 - 为每个子知识点分配至少1题
      let subPointAllocations = [];
      const maxSubPoints = Math.min(subPoints.length, targetCount);
      
      for (let i = 0; i < maxSubPoints; i++) {
        subPointAllocations.push({
          subPoint: subPoints[i],
          allocatedCount: 1
        });
      }
      
      // 如果还有剩余题数，按顺序分配给子知识点
      let remainingCount = targetCount - maxSubPoints;
      let allocationIndex = 0;
      while (remainingCount > 0 && subPointAllocations.length > 0) {
        subPointAllocations[allocationIndex % subPointAllocations.length].allocatedCount++;
        remainingCount--;
        allocationIndex++;
      }
      
      console.log(`📊 题目分配方案:`, subPointAllocations.map(a => `${a.subPoint}: ${a.allocatedCount}题`).join(', '));
      
      // 步骤3: 批量并行查询
      const queryPromises = subPointAllocations.map(async ({ subPoint, allocatedCount }) => {
        try {
          console.log(`  🔍 查询子知识点 "${subPoint}", 需要 ${allocatedCount} 题...`);
          const questions = await cloudDataLoader.getQuestionsByGrammarPoint(subPoint, schoolLevel, null, allocatedCount * 2); // 多查询一些，用于后续补足
          console.log(`  ✅ 子知识点 "${subPoint}" 查询到 ${questions.length} 题`);
          return {
            subPoint,
            requestedCount: allocatedCount,
            questions: questions || [],
            success: true
          };
        } catch (error) {
          console.error(`  ❌ 子知识点 "${subPoint}" 查询失败:`, error);
          return {
            subPoint,
            requestedCount: allocatedCount,
            questions: [],
            success: false,
            error
          };
        }
      });
      
      const queryResults = await Promise.all(queryPromises);
      console.log(`⚡ 批量查询完成，共 ${queryResults.length} 个子知识点`);
      
      // 步骤4: 收集与去重
      let allQuestions = [];
      const usedQuestionIds = new Set();
      
      queryResults.forEach(({ subPoint, requestedCount, questions, success }) => {
        if (success && questions.length > 0) {
          // 从每个子知识点的题目中随机选择分配的数量
          const shuffled = [...questions].sort(() => Math.random() - 0.5);
          const selected = [];
          
          for (const q of shuffled) {
            if (selected.length >= requestedCount) break;
            
            const questionId = q._id || q.id || `${q.text}_${q.answer}`;
            if (!usedQuestionIds.has(questionId)) {
              usedQuestionIds.add(questionId);
              selected.push(q);
            }
          }
          
          allQuestions.push(...selected);
          console.log(`  📦 子知识点 "${subPoint}": 从 ${questions.length} 题中选择了 ${selected.length} 题`);
        }
      });
      
      console.log(`📦 初步收集完成，共 ${allQuestions.length} 题（已去重）`);
      
      // 步骤5: 数量校验与调整
      let finalQuestions = [...allQuestions];
      let loopCount = 0;
      const maxLoops = 3;
      
      while (loopCount < maxLoops) {
        const currentCount = finalQuestions.length;
        
        if (currentCount === targetCount) {
          // 完美匹配
          console.log(`✅ 题目数量完美匹配: ${currentCount} 题`);
          break;
        } else if (currentCount > targetCount) {
          // 题目过多，随机删除多余的
          console.log(`📉 题目过多 (${currentCount} > ${targetCount})，随机删除 ${currentCount - targetCount} 题`);
          const shuffled = finalQuestions.sort(() => Math.random() - 0.5);
          finalQuestions = shuffled.slice(0, targetCount);
          console.log(`✅ 调整后题目数量: ${finalQuestions.length} 题`);
          break;
        } else {
          // 题目不足，需要补足
          const shortage = targetCount - currentCount;
          console.log(`📈 题目不足 (${currentCount} < ${targetCount})，需要补足 ${shortage} 题`);
          
          // 从所有子知识点的题目池中再次随机抽取
          const allAvailableQuestions = [];
          const usedIds = new Set(finalQuestions.map(q => q._id || q.id || `${q.text}_${q.answer}`));
          
          queryResults.forEach(({ questions, success }) => {
            if (success && questions.length > 0) {
              questions.forEach(q => {
                const questionId = q._id || q.id || `${q.text}_${q.answer}`;
                if (!usedIds.has(questionId)) {
                  allAvailableQuestions.push(q);
                  usedIds.add(questionId);
                }
              });
            }
          });
          
          if (allAvailableQuestions.length === 0) {
            console.warn(`⚠️ 没有更多可用题目，当前题目数: ${currentCount}`);
            break;
          }
          
          // 随机选择补足题目
          const shuffled = allAvailableQuestions.sort(() => Math.random() - 0.5);
          const additionalQuestions = shuffled.slice(0, shortage);
          finalQuestions.push(...additionalQuestions);
          
          console.log(`  ➕ 补足了 ${additionalQuestions.length} 题，当前总数: ${finalQuestions.length}`);
          
          loopCount++;
          if (loopCount >= maxLoops) {
            console.warn(`⚠️ 已达到最大循环次数 (${maxLoops})，停止补足`);
            break;
          }
        }
      }
      
      console.log(`🎉 专题题目生成完成，最终题目数: ${finalQuestions.length}/${targetCount}`);
      return finalQuestions;
      
    } catch (error) {
      console.error(`❌ 生成专题题目失败:`, error);
      throw error;
    }
  },

  // 显示变式题选择器（已移除，变式题选择在前一步完成）

  // 生成预览内容
  async generatePreview() {
    try {
      wx.showLoading({
        title: '生成预览中...',
        mask: true
      });

      const { selectedQuestions, variantCount, previewType } = this.data;
      
      
      // 生成预览内容
      const content = await this.generateMaterialContent(selectedQuestions, variantCount, previewType);
      
      this.setData({
        previewContent: content,
        showPreview: true
      });

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.error('生成预览失败:', error);
      wx.showToast({
        title: '预览生成失败',
        icon: 'error'
      });
    }
  },

  // 生成学案内容
  async generateMaterialContent(questions, variantCount, type = 'student') {
    let content = '';
    
    // 只在第一次生成时尝试从数据库获取真实题目，避免重复生成
    if (!this.data.cachedRealQuestions) {
      let realQuestions = [];
      try {
        console.log('开始尝试加载 cloudDataLoader...');
        const cloudDataLoader = require('../../../utils/cloudDataLoader.js');
        console.log('cloudDataLoader 加载成功:', typeof cloudDataLoader);
        
        // 判断作业类型（从assignmentData中获取）
        const assignmentType = this.data.assignmentData?.type || '';
        const isGaokaoMode = assignmentType === 'gaokao';
        // 专题模式判断：从assignmentData或type参数判断
        const isTopicMode = assignmentType === 'topic' || type === 'topic';
        // 判断是否是初中模块
        const isMiddleSchoolMode = assignmentType === 'zhongkao' || assignmentType === 'topic-middle' || assignmentType === 'custom-middle';
        const schoolLevel = isMiddleSchoolMode ? 'middle' : 'high'; // 初中模块使用 'middle'，高中模块使用 'high'
        
        // ========== 专题模式：使用新的 generateQuestionsByTopic 函数 ==========
        if (isTopicMode) {
          // 从 questions 中提取专题名称（通常是第一个题目的 grammarPoint 或 category）
          // 或者从 assignmentData 中获取专题名称
          let topicName = this.data.assignmentData?.topicName || 
                         this.data.assignmentData?.topic || 
                         (questions.length > 0 ? (questions[0].grammarPoint || questions[0].category) : null);
          
          if (!topicName) {
            console.warn('⚠️ 专题模式但未找到专题名称，尝试从题目中推断...');
            // 尝试从题目中推断专题名称
            const topicMapping = cloudDataLoader.getTopicToSubPointsMapping(schoolLevel);
            const allTopics = Object.keys(topicMapping);
            
            // 查找包含当前题目语法点的专题
            for (const topic of allTopics) {
              const subPoints = topicMapping[topic];
              const firstQuestionPoint = questions[0]?.grammarPoint || questions[0]?.category;
              if (firstQuestionPoint && subPoints.includes(firstQuestionPoint)) {
                topicName = topic;
                console.log(`✅ 推断专题名称: "${topicName}"`);
                break;
              }
            }
          }
          
          if (!topicName) {
            console.error('❌ 无法确定专题名称，回退到旧逻辑');
            // 回退到旧逻辑
          } else {
            // 计算目标题数（通常是传入的 questions 数量，或默认20）
            const targetCount = questions.length > 0 ? questions.length : 20;
            
            console.log(`🎯 专题模式：使用新函数生成题目，专题: "${topicName}", 目标题数: ${targetCount}`);
            
            try {
              // 使用新的 generateQuestionsByTopic 函数
              const topicQuestions = await this.generateQuestionsByTopic(topicName, targetCount, schoolLevel);
              
              if (topicQuestions.length > 0) {
                realQuestions = topicQuestions;
                console.log(`✅ 专题模式：成功生成 ${realQuestions.length} 道题目`);
              } else {
                console.warn('⚠️ 专题模式：新函数未返回题目，回退到旧逻辑');
                // 回退到旧逻辑
              }
            } catch (error) {
              console.error('❌ 专题模式：新函数执行失败，回退到旧逻辑:', error);
              // 回退到旧逻辑
            }
          }
        }
        
        // ========== 非专题模式或专题模式回退：使用旧逻辑 ==========
        if (!isTopicMode || realQuestions.length === 0) {
          // 统计每个语法点需要的题目数量（根据传入的questions数据）
          const pointCountMap = {};
          // 建立语法点到原始题目的映射，用于数据库查找失败时回退
          const pointQuestionsMap = {};
          questions.forEach(q => {
            const point = q.grammarPoint || q.category;
            pointCountMap[point] = (pointCountMap[point] || 0) + 1;
            if (!pointQuestionsMap[point]) {
              pointQuestionsMap[point] = [];
            }
            pointQuestionsMap[point].push(q);
          });
          
          // 高考配比模式：如果有变式题，需要为每个语法点获取 (1 + variantCount) 道题目
          if (isGaokaoMode && variantCount > 0) {
            console.log(`🎯 高考配比模式，变式题数量: ${variantCount}，需要为每个语法点获取 ${1 + variantCount} 道题目`);
            // 重新计算每个语法点需要的题目数量
            Object.keys(pointCountMap).forEach(point => {
              pointCountMap[point] = 1 + variantCount; // 1道原题 + variantCount道变式题
            });
            console.log('🎯 更新后的语法点及数量:', pointCountMap);
          }
          
          console.log('尝试从数据库获取真实题目，语法点及数量:', pointCountMap);
          
          // 为每个语法点获取真实题目（优化：并行查询）
          // 专题模式：根据pointCountMap中的数量提取
          // 高考配比模式（有变式题）：每个语法点提取 (1 + variantCount) 道题目
          // 其他模式：根据变式题数量，每个语法点提取 (1 + variantCount) 道题目
          
          // 🚀 性能优化：使用 Promise.all 并行查询所有知识点
          const queryStartTime = Date.now();
          const queryPromises = Object.entries(pointCountMap).map(async ([point, count]) => {
            try {
              console.log(`正在获取 ${point} 的题目，需要 ${count} 道...传递的 schoolLevel: ${schoolLevel}`);
              const dbQuestions = await cloudDataLoader.getQuestionsByGrammarPoint(point, schoolLevel);
              console.log(`获取到 ${point} 题目数量:`, dbQuestions ? dbQuestions.length : 0);
              return { point, count, questions: dbQuestions || [], success: true };
            } catch (error) {
              console.warn(`⚠️ 获取 ${point} 题目失败:`, error);
              return { point, count, questions: [], success: false, error };
            }
          });
          
          // 等待所有查询完成
          const queryResults = await Promise.all(queryPromises);
          const queryEndTime = Date.now();
          console.log(`⚡ 并行查询完成，耗时: ${queryEndTime - queryStartTime}ms`);
          
          // 处理查询结果 - 专题模式需要智能补足机制
          // 注意：isTopicMode 已在上面声明，这里直接使用
          const pointResults = [];
          const usedQuestionIds = new Set(); // 用于去重
          
          queryResults.forEach(({ point, count, questions, success, error }) => {
            if (success && questions.length > 0) {
              // 根据需要的数量提取题目
              const selected = this.getRandomQuestions(questions, count);
              const actualCount = selected.length;
              
              pointResults.push({
                point,
                requestedCount: count,
                actualCount: actualCount,
                questions: selected,
                hasShortage: actualCount < count,
                shortage: Math.max(0, count - actualCount),
                availableQuestions: questions // 保存所有可用题目，用于补足
              });
              
              // 记录已使用的题目ID
              selected.forEach(q => {
                const uniqueKey = q._id || q.id || q.text;
                usedQuestionIds.add(uniqueKey);
              });
              
              console.log(`✅ 从数据库获取到 ${actualCount}/${count} 道 ${point} 题目`);
            } else {
              // 数据库找不到题目或查询失败
              const reason = success ? '未找到题目' : '查询失败';
              console.log(`⚠️ ${point} ${reason}，需要 ${count} 道题目`);
              
              pointResults.push({
                point,
                requestedCount: count,
                actualCount: 0,
                questions: [],
                hasShortage: true,
                shortage: count,
                availableQuestions: []
              });
            }
          });
          
          // 专题模式：智能补足机制（旧逻辑，仅在回退时使用）
          if (isTopicMode && realQuestions.length === 0) {
            const totalRequested = pointResults.reduce((sum, r) => sum + r.requestedCount, 0);
            const totalActual = pointResults.reduce((sum, r) => sum + r.actualCount, 0);
            const totalShortage = totalRequested - totalActual;
            
            console.log(`📊 专题模式题目统计: 需要 ${totalRequested} 道，已获取 ${totalActual} 道，缺少 ${totalShortage} 道`);
            
            if (totalShortage > 0) {
              // 获取当前专题的所有子知识点名称，用于验证题目分类
              const validPoints = new Set(pointResults.map(r => r.point));
              
              // 找出有富余题目的子知识点（题目数量 > 已分配数量）
              const pointsWithSurplus = pointResults.filter(r => 
                r.availableQuestions && r.availableQuestions.length > r.actualCount
              );
              
              if (pointsWithSurplus.length > 0) {
                console.log(`🔄 开始从 ${pointsWithSurplus.length} 个有富余的子知识点补足题目...`);
                
                // 按富余题目数量排序，优先从富余最多的子知识点补足
                pointsWithSurplus.sort((a, b) => {
                  const surplusA = a.availableQuestions.length - a.actualCount;
                  const surplusB = b.availableQuestions.length - b.actualCount;
                  return surplusB - surplusA;
                });
                
                let remainingShortage = totalShortage;
                
                // 从有富余的子知识点补足
                for (const pointResult of pointsWithSurplus) {
                  if (remainingShortage <= 0) break;
                  
                  const surplus = pointResult.availableQuestions.length - pointResult.actualCount;
                  if (surplus <= 0) continue;
                  
                  // 获取未使用的题目，并验证题目分类是否正确
                  const unusedQuestions = pointResult.availableQuestions.filter(q => {
                    const uniqueKey = q._id || q.id || q.text;
                    if (usedQuestionIds.has(uniqueKey)) return false;
                    
                    // 验证题目的分类是否属于当前专题的子知识点
                    const qGrammarPoint = (q.grammarPoint || '').trim();
                    const qCategory = (q.category || '').trim();
                    
                    // 如果题目的 grammarPoint 或 category 不在当前专题的子知识点列表中，跳过
                    if (qGrammarPoint && !validPoints.has(qGrammarPoint) && qCategory && !validPoints.has(qCategory)) {
                      console.log(`  ⚠️ 跳过不属于当前专题的题目: ${qGrammarPoint || qCategory} (来自 ${pointResult.point})`);
                      return false;
                    }
                    
                    return true;
                  });
                  
                  if (unusedQuestions.length > 0) {
                    const supplementCount = Math.min(remainingShortage, unusedQuestions.length);
                    const supplementQuestions = this.getRandomQuestions(unusedQuestions, supplementCount);
                    
                    // 添加到该子知识点的题目列表
                    pointResult.questions.push(...supplementQuestions);
                    pointResult.actualCount += supplementCount;
                    // 更新 hasShortage 和 shortage
                    pointResult.hasShortage = pointResult.actualCount < pointResult.requestedCount;
                    pointResult.shortage = Math.max(0, pointResult.requestedCount - pointResult.actualCount);
                    remainingShortage -= supplementCount;
                    
                    // 记录已使用的题目ID
                    supplementQuestions.forEach(q => {
                      const uniqueKey = q._id || q.id || q.text;
                      usedQuestionIds.add(uniqueKey);
                    });
                    
                    console.log(`  ✅ 从 ${pointResult.point} 补足 ${supplementCount} 道题目（剩余富余: ${unusedQuestions.length - supplementCount}）`);
                  }
                }
                
                if (remainingShortage > 0) {
                  console.log(`⚠️ 仍有 ${remainingShortage} 道题目无法补足，将使用占位符题目`);
                }
              } else {
                console.log(`⚠️ 没有富余的子知识点可以补足，将使用占位符题目`);
              }
            }
          }
          
          // 收集所有题目
          pointResults.forEach(({ point, actualCount, questions, requestedCount }) => {
            if (questions.length > 0) {
              realQuestions.push(...questions);
            }
            
            // 如果仍有不足，使用占位符题目补足（使用更新后的 actualCount）
            if (actualCount < requestedCount) {
              const placeholderCount = requestedCount - actualCount;
              console.log(`⚠️ ${point} 仍缺少 ${placeholderCount} 道题目，使用占位符补足`);
              const smartPlaceholders = this.generateSmartPlaceholders(point, placeholderCount, pointQuestionsMap[point] || []);
              realQuestions.push(...smartPlaceholders);
            }
          });
          
          // 去重：确保同一道题目不会出现两次
          const uniqueQuestions = this.removeDuplicateQuestions(realQuestions);
          
          // 专题模式：去重后如果数量不足，再次补足（仅旧逻辑需要）
          if (isTopicMode && realQuestions.length === 0 && uniqueQuestions.length < questions.length) {
            const shortageAfterDedup = questions.length - uniqueQuestions.length;
            console.log(`🔄 去重后缺少 ${shortageAfterDedup} 道题目，尝试再次补足...`);
            
            // 找出仍有富余题目的子知识点
            const pointsWithSurplus = pointResults.filter(r => 
              r.availableQuestions && r.availableQuestions.length > r.actualCount
            );
            
            if (pointsWithSurplus.length > 0) {
              // 获取当前专题的所有子知识点名称，用于验证题目分类
              const validPoints = new Set(pointResults.map(r => r.point));
              
              // 按富余题目数量排序
              pointsWithSurplus.sort((a, b) => {
                const surplusA = a.availableQuestions.length - a.actualCount;
                const surplusB = b.availableQuestions.length - b.actualCount;
                return surplusB - surplusA;
              });
              
              let remainingShortage = shortageAfterDedup;
              const usedIds = new Set(uniqueQuestions.map(q => q._id || q.id || q.text));
              
              for (const pointResult of pointsWithSurplus) {
                if (remainingShortage <= 0) break;
                
                const unusedQuestions = pointResult.availableQuestions.filter(q => {
                  const uniqueKey = q._id || q.id || q.text;
                  if (usedIds.has(uniqueKey)) return false;
                  
                  // 验证题目分类
                  const qGrammarPoint = (q.grammarPoint || '').trim();
                  const qCategory = (q.category || '').trim();
                  if (qGrammarPoint && !validPoints.has(qGrammarPoint) && qCategory && !validPoints.has(qCategory)) {
                    return false;
                  }
                  
                  return true;
                });
                
                if (unusedQuestions.length > 0) {
                  const supplementCount = Math.min(remainingShortage, unusedQuestions.length);
                  const supplementQuestions = this.getRandomQuestions(unusedQuestions, supplementCount);
                  uniqueQuestions.push(...supplementQuestions);
                  remainingShortage -= supplementCount;
                  
                  supplementQuestions.forEach(q => {
                    const uniqueKey = q._id || q.id || q.text;
                    usedIds.add(uniqueKey);
                  });
                  
                  console.log(`  ✅ 去重后从 ${pointResult.point} 补足 ${supplementCount} 道题目`);
                }
              }
              
              if (remainingShortage > 0) {
                console.log(`⚠️ 去重后仍有 ${remainingShortage} 道题目无法补足`);
              }
            }
          }
          
          // 确保题目总数正确（仅非专题模式或专题模式回退时执行）
          if (!isTopicMode || realQuestions.length === 0) {
            if (uniqueQuestions.length > 0) {
              const finalCount = uniqueQuestions.length;
              // 计算目标题数：高考配比模式有变式题时，需要考虑变式题数量
              let targetCount = questions.length;
              if (isGaokaoMode && variantCount > 0) {
                // 高考配比模式有变式题：目标题数 = 原题数量 * (1 + 变式题数量)
                targetCount = questions.length * (1 + variantCount);
                console.log(`🎯 高考配比模式有变式题：原题 ${questions.length} 道，变式题 ${variantCount} 道/题，目标总数 ${targetCount} 道`);
              }
              console.log(`✅ 使用数据库真实题目和占位符题目，共 ${finalCount} 道（去重后，目标: ${targetCount} 道）`);
              if (finalCount < targetCount) {
                console.log(`⚠️ 题目数量不足: 需要 ${targetCount} 道，实际 ${finalCount} 道，缺少 ${targetCount - finalCount} 道`);
              } else if (finalCount > targetCount) {
                // 如果数量超过目标，随机删除多余的题目
                // 注意：高考配比模式有变式题时不应该执行此删除逻辑，因为题目数量是正确的
                if (isGaokaoMode && variantCount > 0) {
                  console.log(`✅ 高考配比模式有变式题：保留所有 ${finalCount} 道题目（${questions.length} 道原题 + ${questions.length * variantCount} 道变式题）`);
                  this.setData({ cachedRealQuestions: uniqueQuestions });
                  questions = uniqueQuestions;
                } else {
                  // 其他模式：如果数量超过目标，随机删除多余的题目
                  const shuffled = [...uniqueQuestions].sort(() => Math.random() - 0.5);
                  const trimmedQuestions = shuffled.slice(0, targetCount);
                  console.log(`⚠️ 题目数量超出: 需要 ${targetCount} 道，实际 ${finalCount} 道，已删除 ${finalCount - targetCount} 道`);
                  this.setData({ cachedRealQuestions: trimmedQuestions });
                  questions = trimmedQuestions;
                }
              } else {
                this.setData({ cachedRealQuestions: uniqueQuestions });
                questions = uniqueQuestions;
              }
            } else {
              console.log('⚠️ 未获取到任何题目，使用原题目');
              this.setData({ cachedRealQuestions: questions });
            }
          } else {
            // 专题模式：使用新函数返回的题目
            console.log(`✅ 专题模式：使用新函数生成的 ${realQuestions.length} 道题目`);
            this.setData({ cachedRealQuestions: realQuestions });
            questions = realQuestions;
          }
        } // 闭合 if (!isTopicMode || realQuestions.length === 0)
      } catch (error) {
        console.error('获取真实题目失败:', error);
        console.log('使用原题目');
        this.setData({ cachedRealQuestions: questions });
      }
    } else {
      // 使用缓存的题目，确保所有版本使用相同的题目
      questions = this.data.cachedRealQuestions;
      console.log('使用缓存的题目，共', questions.length, '道');
    }
    
    // 添加调试信息（两种类型都打印）
    console.log('生成学案时的参数:', {
      questionsLength: questions.length,
      variantCount: variantCount,
      type: type
    });
    
    // 将题目按语法点分组
    const groupedQuestions = {};
    
    // 按语法点分组题目
    for (const question of questions) {
      const point = question.grammarPoint || question.category || '综合';
      if (!groupedQuestions[point]) {
        groupedQuestions[point] = [];
      }
      groupedQuestions[point].push(question);
    }
    
    // 判断是否为专题模式：
    // 1. 从assignmentData中明确标记为topic模式
    // 2. 或者某个语法点有多题且没有变式题（兼容旧逻辑）
    // 注意：高考配比模式即使有多个题目，也应该按照变式题逻辑处理
    const assignmentType = this.data.assignmentData?.type || '';
    const isGaokaoModeForDisplay = assignmentType === 'gaokao';
    const isTopicModeFromData = assignmentType === 'topic';
    const isTopicMode = isTopicModeFromData || 
      (Object.values(groupedQuestions).some(qs => qs.length > 1 && variantCount === 0) && !isGaokaoModeForDisplay);
    
    // 生成学案内容
    let exerciseIndex = 1;
    for (const [point, pointQuestions] of Object.entries(groupedQuestions)) {
      if (isTopicMode && pointQuestions.length > 1) {
        // 专题模式：每个语法点的多道题目都作为独立练习展示
        for (let i = 0; i < pointQuestions.length; i++) {
          const question = pointQuestions[i];
          content += `### 练习${exerciseIndex}：${point}\n`;
          
          // 格式化题目文本：根据题目类型显示
          const formattedQuestion = this.formatQuestionText(question);
          content += `**题目**: ${formattedQuestion}\n`;
          
          if (type === 'teacher') {
            content += `**答案**: ${question.answer || question.correctAnswer}\n`;
            content += `**解析**: ${question.analysis || '暂无解析'}\n`;
          }
          
          content += `\n---\n\n`;
          exerciseIndex++;
        }
      } else {
        // 其他模式：第一题作为原题，剩余的作为变式题
        const mainQuestion = pointQuestions[0];
        const variantQuestions = pointQuestions.slice(1);
        
        content += `### 练习${exerciseIndex}：${point}\n`;
        
        // 格式化题目文本：根据题目类型显示
        const formattedQuestion = this.formatQuestionText(mainQuestion);
        content += `**题目**: ${formattedQuestion}\n`;
        
        if (type === 'teacher') {
          content += `**答案**: ${mainQuestion.answer || mainQuestion.correctAnswer}\n`;
          content += `**解析**: ${mainQuestion.analysis || '暂无解析'}\n`;
        }
        
        // 添加变式题（如果有）
        if (variantQuestions.length > 0) {
          content += `\n**变式练习题**:\n`;
          for (let j = 0; j < variantQuestions.length; j++) {
            const variant = variantQuestions[j];
            const formattedVariant = this.formatQuestionText(variant);
            content += `${j + 1}. ${formattedVariant}`;
            if (type === 'teacher') {
              content += ` (答案: ${variant.answer || variant.correctAnswer})`;
            }
            content += `\n`;
          }
        }
        
        content += `\n---\n\n`;
        exerciseIndex++;
      }
    }
    
    // 不再添加“知识点总结 / 教学建议 / 课后作业”，避免预览和导出出现多余内容
    // 教师版额外信息可在需要时单独生成，不耦合在题目文本中

    return content;
  },

  // 从文本中提取选项
  extractOptionsFromText(text) {
    const options = [];
    // 匹配格式：A. xxx B. xxx C. xxx D. xxx
    const optionPattern = /([A-D])\.\s*([^A-D]+?)(?=\s+[A-D]\.|$)/g;
    let match;
    
    while ((match = optionPattern.exec(text)) !== null) {
      options.push({
        label: match[1],
        text: match[2].trim()
      });
    }
    
    return options;
  },

  // 从文本中移除选项部分
  removeOptionsFromText(text) {
    // 匹配选项开始：空格 + A-D + 点号 + 空格
    const optionStartPattern = /\s+[A-D]\.\s+/;
    const cutIndex = text.search(optionStartPattern);
    
    if (cutIndex > 0) {
      return text.substring(0, cutIndex).trim();
    }
    
    return text;
  },

  // 格式化题目文本：根据题目类型正确显示
  formatQuestionText(question) {
    if (!question) return '';
    
    const questionType = question.type || '';
    let questionText = question.text || '';
    
    // 如果是选择题（choice），需要检查文本中是否已包含选项
    if (questionType === 'choice') {
      // 检查文本中是否已经包含选项（格式如 "A. xxx B. xxx" 或 "A. xxx  B. xxx"）
      const hasOptionsInText = /[A-D]\.\s+[A-Z]/.test(questionText) || 
                                /[A-D]\.\s{2,}[A-Z]/.test(questionText) ||
                                /选项\s*[A-D]/.test(questionText);
      
      // 如果没有选项，尝试从options字段添加
      if (!hasOptionsInText) {
        if (question.options && Array.isArray(question.options) && question.options.length > 0) {
          // 选项可能是字符串数组或对象数组
          const optionsText = question.options.map((opt, index) => {
            const label = String.fromCharCode(65 + index); // A, B, C, D
            // 处理选项格式：可能是字符串或对象
            let optionText = typeof opt === 'string' ? opt : (opt.text || opt.label || opt);
            
            // 检查选项是否已经包含标签（如 "A. xxx"），如果包含就不重复添加
            const labelPattern = new RegExp(`^${label}\\.\\s*`, 'i');
            if (!labelPattern.test(optionText)) {
              // 选项不包含标签，添加标签
              optionText = `${label}. ${optionText}`;
            }
            // 如果已经包含标签，直接使用
            
            return optionText;
          }).join(' ');
          questionText = `${questionText} ${optionsText}`;
        } else {
          // 尝试从文本中提取选项（如果文本格式是 "题目 A. xxx B. xxx"）
          const extractedOptions = this.extractOptionsFromText(questionText);
          if (extractedOptions.length >= 2) {
            // 成功提取到选项，移除text中的选项部分
            const cleanedText = this.removeOptionsFromText(questionText);
            const optionsText = extractedOptions.map(opt => `${opt.label}. ${opt.text}`).join(' ');
            questionText = `${cleanedText} ${optionsText}`;
          } else {
            // 无法提取选项，保持原样但给出警告
            console.log('⚠️ 选择题缺少选项字段且无法从text中提取:', question);
          }
        }
      }
    }
    
    // 填空题或其他类型，直接返回文本（不添加选项）
    return questionText;
  },

  // 随机选择题目
  getRandomQuestions(questions, count) {
    if (!questions || questions.length === 0) return [];
    
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },

  // 去重题目列表（基于题目的唯一标识）
  removeDuplicateQuestions(questions) {
    if (!questions || questions.length === 0) return [];
    
    const seen = new Set();
    const uniqueQuestions = [];
    
    for (const question of questions) {
      // 优先使用 _id，其次使用 id，最后使用 text 作为唯一标识
      const uniqueKey = question._id || question.id || question.text;
      
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueQuestions.push(question);
      } else {
        console.log(`⚠️ 发现重复题目，已跳过: ${uniqueKey}`);
      }
    }
    
    if (questions.length !== uniqueQuestions.length) {
      console.log(`✅ 去重完成: 原始 ${questions.length} 道题目，去重后 ${uniqueQuestions.length} 道题目`);
    }
    
    return uniqueQuestions;
  },

  // 生成变式题内容
  generateVariantQuestion(originalQuestion, variantIndex) {
    const grammarPoint = originalQuestion.grammarPoint || originalQuestion.category;
    const baseText = originalQuestion.text;
    
    // 根据实际语法点生成对应的变式题
    const variants = {
      '介词 + 名词/动名词': [
        `介词填空练习 - The book is ___ the table.`,
        `介词搭配练习 - I'm interested ___ learning English.`,
        `介词用法辨析 - The meeting will be held ___ Monday morning.`
      ],
      'it相关': [
        `it用法练习 - ___ is important to study hard.`,
        `it形式主语练习 - ___ seems that he is right.`,
        `it强调句练习 - ___ was yesterday that I met him.`
      ],
      '从属连词综合': [
        `连词选择练习 - I like both tea ___ coffee.`,
        `连词用法练习 - ___ it's raining, we'll stay inside.`,
        `连词综合练习 - He said ___ he would come.`
      ],
      'a和an': [
        `冠词选择练习 - I have ___ apple and ___ orange.`,
        `a/an用法练习 - This is ___ useful book.`,
        `冠词填空练习 - She is ___ honest person.`
      ],
      '复合词和外来词': [
        `复合词练习 - This is a ___ story.`,
        `外来词练习 - The ___ of the situation is clear.`,
        `词汇综合练习 - This is a ___ problem.`
      ],
      '主从句与动词': [
        `主从句练习 - I suggest that he ___ the work.`,
        `动词时态练习 - I ___ to school every day.`,
        `从句综合练习 - He said he ___ the work yesterday.`
      ],
      '时态(过去进行时)': [
        `过去进行时练习 - I ___ TV when you called.`,
        `时态转换练习 - He said he ___ the work yesterday.`,
        `时态综合练习 - By the time we arrived, the meeting ___.`
      ],
      '不定式综合': [
        `不定式练习 - I want ___ English well.`,
        `不定式用法练习 - It's important ___ hard.`,
        `不定式综合练习 - I hope ___ you soon.`
      ],
      '比较级': [
        `比较级练习 - This book is ___ than that one.`,
        `最高级练习 - This is the ___ book I've ever read.`,
        `比较综合练习 - The weather is ___ today.`
      ],
      '副词修饰形容词/副词': [
        `副词位置练习 - He ___ speaks English well.`,
        `副词用法练习 - She runs ___ in the morning.`,
        `副词修饰练习 - The car moves ___ on the highway.`
      ],
      'whose': [
        `whose用法练习 - This is the student ___ book was lost.`,
        `关系代词练习 - The man ___ is talking is my teacher.`,
        `whose综合练习 - This is the reason ___ I came.`
      ],
      'where': [
        `where用法练习 - This is the place ___ we met.`,
        `关系副词练习 - This is the time ___ we should leave.`,
        `where综合练习 - This is the reason ___ I came.`
      ]
    };
    
    // 根据语法点选择对应的变式题模板，如果没有匹配则使用通用模板
    const grammarVariants = variants[grammarPoint] || [
      `语法点练习 - 请根据${grammarPoint}完成练习。`,
      `变式练习 - 请完成${grammarPoint}相关练习。`,
      `综合练习 - 请运用${grammarPoint}知识完成题目。`
    ];
    
    const variantIndex_mod = (variantIndex - 1) % grammarVariants.length;
    
    return grammarVariants[variantIndex_mod];
  },

  // 切换预览类型
  switchPreviewType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      previewType: type
    });
    
    // 使用缓存的题目重新生成预览，避免重新获取题目
    if (this.data.cachedRealQuestions) {
      this.generatePreviewWithCachedQuestions();
    } else {
      this.generatePreview();
    }
  },

  // 使用缓存题目生成预览
  async generatePreviewWithCachedQuestions() {
    try {
      wx.showLoading({
        title: '生成预览中...',
        mask: true
      });

      const { cachedRealQuestions, variantCount, previewType } = this.data;
      
      // 生成预览内容
      const content = await this.generateMaterialContent(cachedRealQuestions, variantCount, previewType);
      
      this.setData({
        previewContent: content,
        showPreview: true
      });

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.error('生成预览失败:', error);
      wx.showToast({
        title: '预览生成失败',
        icon: 'error'
      });
    }
  },

  // 生成学案（带答案）并转发
  async generateWithAnswers() {
    await this.generateAndShare('teacher');
  },

  // 生成学案（无答案）并转发
  async generateWithoutAnswers() {
    await this.generateAndShare('student');
  },

  // 生成并分享
  async generateAndShare(type) {
    try {
      this.setData({ isGenerating: true });
      
      wx.showLoading({
        title: '生成学案中...',
        mask: true
      });

      // 使用缓存的题目，确保分享内容与预览一致
      const questions = this.data.cachedRealQuestions || this.data.selectedQuestions;
      const { variantCount } = this.data;
      const content = await this.generateMaterialContent(questions, variantCount, type);
      
      // 保存文件
      const fileName = `${this.data.assignmentData?.title || '学案'}_${type === 'teacher' ? '教师版' : '学生版'}_${Date.now()}.html`;
      const filePath = await this.saveAsHtml(content, fileName);
      
      wx.hideLoading();
      this.setData({ isGenerating: false });
      
      // 生成分享链接并分享
      const shareUrl = await this.generateShareUrl(content, type);
      this.shareToWechat(shareUrl, type);
      
    } catch (error) {
      this.setData({ isGenerating: false });
      wx.hideLoading();
      console.error('生成学案失败:', error);
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      });
    }
  },

  // 生成分享链接
  async generateShareUrl(content, type) {
    // 这里应该调用后端API生成分享链接
    // 暂时返回一个模拟链接
    const baseUrl = 'https://example.com/study-plan';
    const params = {
      content: encodeURIComponent(content),
      type: type,
      timestamp: Date.now()
    };
    
    return `${baseUrl}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
  },

  // 分享到微信
  shareToWechat(shareUrl, type) {
    // 显示分享成功提示
    wx.showModal({
      title: '学案已生成',
      content: '学案已准备完成！请点击右上角的分享按钮，选择要分享的好友或群聊。',
      showCancel: false,
      confirmText: '我知道了',
      success: () => {
        // 触发微信分享
        wx.showShareMenu({
          withShareTicket: true,
          success: () => {
            console.log('分享菜单显示成功');
          },
          fail: (error) => {
            console.error('分享菜单显示失败:', error);
            // 备用方案：复制链接到剪贴板
            wx.setClipboardData({
              data: shareUrl,
              success: () => {
                wx.showToast({
                  title: '链接已复制到剪贴板',
                  icon: 'success'
                });
              }
            });
          }
        });
      }
    });
  },

  // 保存为HTML格式
  async saveAsHtml(content, fileName) {
    try {
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      
      // 生成HTML格式内容
      const htmlContent = this.convertToHtml(content);
      
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log('HTML文件保存成功:', filePath);
      
      return filePath;
    } catch (error) {
      console.error('保存HTML文件失败:', error);
      throw error;
    }
  },

  // 转换为HTML格式
  convertToHtml(markdownContent) {
    // 更完善的Markdown到HTML转换
    let html = markdownContent
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/---/g, '<hr>');
    
    // 包装段落
    html = '<p>' + html + '</p>';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>学案</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            line-height: 1.8; 
            margin: 0; 
            padding: 20px; 
            background: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 15px; 
            margin-bottom: 30px;
            text-align: center;
        }
        h2 { 
            color: #34495e; 
            margin-top: 40px; 
            margin-bottom: 20px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        h3 { 
            color: #7f8c8d; 
            margin-top: 25px; 
            margin-bottom: 15px;
        }
        strong { 
            color: #e74c3c; 
            font-weight: 600;
        }
        hr { 
            border: none; 
            border-top: 2px solid #ecf0f1; 
            margin: 30px 0; 
        }
        p {
            margin: 15px 0;
            text-align: justify;
        }
        li {
            margin: 8px 0;
            padding-left: 10px;
        }
        .question { 
            background: linear-gradient(135deg, #f8f9fa, #e9ecef); 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            border-left: 4px solid #3498db;
        }
        .answer { 
            background: linear-gradient(135deg, #d4edda, #c3e6cb); 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 6px; 
            border-left: 4px solid #28a745;
        }
        .info-section {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
        }
        .suggestion-section {
            background: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        ${html}
    </div>
</body>
</html>`;
  },

  // 分享到微信
  shareToWechat(filePath, fileName) {
    wx.openDocument({
      filePath: filePath,
      fileType: 'html',
      showMenu: true, // 显示分享菜单
      success: () => {
        // 显示分享指引
        wx.showModal({
          title: '学案已生成',
          content: '学案已准备完成！\n\n请点击右上角的分享按钮，选择要分享的好友或群聊。',
          confirmText: '我知道了',
          showCancel: false,
          success: () => {
            wx.showToast({
              title: '请使用右上角分享',
              icon: 'success',
              duration: 2000
            });
          }
        });
      },
      fail: (error) => {
        console.error('打开文件失败:', error);
        // 提供备用分享方案
        wx.showModal({
          title: '文件已生成',
          content: `学案已保存为: ${fileName}\n\n由于系统限制，无法直接打开文件。\n\n您可以选择：\n1. 复制内容到剪贴板\n2. 保存到手机相册\n3. 通过其他方式分享`,
          confirmText: '复制内容',
          cancelText: '我知道了',
          success: (res) => {
            if (res.confirm) {
              this.copyContentToClipboard();
            }
          }
        });
      }
    });
  },

  // 复制内容到剪贴板（只包含题目部分：练习标题 + 题干）
  async copyContentToClipboard() {
    try {
      wx.showLoading({
        title: '准备复制...',
        mask: true
      });

      // 优先使用缓存的真实题目，如果没有则使用选中的题目
      const questions = this.data.cachedRealQuestions || this.data.selectedQuestions;
      const { variantCount, previewType } = this.data;
      
      if (!questions || questions.length === 0) {
        wx.hideLoading();
        wx.showToast({
          title: '没有可复制的内容',
          icon: 'none'
        });
        return;
      }

      console.log('开始生成复制内容，题目数量:', questions.length, '预览类型:', previewType);
      
      // 生成学案内容
      const markdownContent = await this.generateMaterialContent(questions, variantCount, previewType);
      const isTeacher = previewType === 'teacher';

      console.log('生成的内容长度:', markdownContent.length);

      // 只保留“练习内容”部分：
      // 学生版：每一题的标题和题干
      // 教师版：每一题的标题、题干 + 答案 + 解析
      const questionBlocks = [];
      const lines = markdownContent.split('\n');
      let currentBlock = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 匹配 "### 练习X：语法点"
        const match = line.match(/^###\s*练习(\d+)[：:](.*)$/);
        if (match) {
          // 开启新的题目块
          if (currentBlock) {
            questionBlocks.push(currentBlock.join('\n'));
          }
          currentBlock = [];
          const index = match[1];
          const label = (match[2] || '').trim();
          currentBlock.push(`练习${index}：${label}`);
          continue;
        }

        if (currentBlock) {
          // 题干行：以 "**题目**" 开头
          if (/^\*\*题目\*\*\s*:/.test(line)) {
            const plainLine = line.replace(/^\*\*题目\*\*\s*:/, '题目:').trim();
            currentBlock.push(plainLine);
            continue;
          }

          // 教师版额外包含答案和解析
          if (isTeacher && /^\*\*答案\*\*\s*:/.test(line)) {
            const answerLine = line.replace(/^\*\*答案\*\*\s*:/, '答案:').trim();
            currentBlock.push(answerLine);
            continue;
          }

          if (isTeacher && /^\*\*解析\*\*\s*:/.test(line)) {
            const analysisLine = line.replace(/^\*\*解析\*\*\s*:/, '解析:').trim();
            currentBlock.push(analysisLine);
            continue;
          }

          // 变式练习题标题行
          if (/^\*\*变式练习题\*\*\s*:/.test(line)) {
            currentBlock.push('变式练习题:');
            continue;
          }

          // 变式题内容行（格式：数字. 题目内容）
          if (/^\d+\.\s+/.test(line)) {
            const variantLine = line.replace(/^\d+\.\s+/, '').trim();
            currentBlock.push(variantLine);
            continue;
          }
        }
      }

      // 收尾，把最后一题加入
      if (currentBlock) {
        questionBlocks.push(currentBlock.join('\n'));
      }

      console.log('提取到的题目块数量:', questionBlocks.length);

      // 拼成最终要复制的内容
      let textToCopy = '';
      if (questionBlocks.length > 0) {
        textToCopy = questionBlocks.join('\n\n');
      } else {
        // 兜底：如果解析不到题目，尝试从预览内容中提取
        const { stripMarkdown } = require('../../../utils/markdown.js');
        if (this.data.previewContent) {
          // 从预览内容中提取题目部分
          const previewLines = this.data.previewContent.split('\n');
          const previewBlocks = [];
          let previewBlock = null;
          
          for (const line of previewLines) {
            const match = line.match(/^###\s*练习(\d+)[：:](.*)$/);
            if (match) {
              if (previewBlock) {
                previewBlocks.push(previewBlock.join('\n'));
              }
              previewBlock = [];
              const index = match[1];
              const label = (match[2] || '').trim();
              previewBlock.push(`练习${index}：${label}`);
            } else if (previewBlock) {
              if (/^\*\*题目\*\*\s*:/.test(line)) {
                previewBlock.push(line.replace(/^\*\*题目\*\*\s*:/, '题目:').trim());
              } else if (isTeacher && /^\*\*答案\*\*\s*:/.test(line)) {
                previewBlock.push(line.replace(/^\*\*答案\*\*\s*:/, '答案:').trim());
              } else if (isTeacher && /^\*\*解析\*\*\s*:/.test(line)) {
                previewBlock.push(line.replace(/^\*\*解析\*\*\s*:/, '解析:').trim());
              }
            }
          }
          
          if (previewBlock) {
            previewBlocks.push(previewBlock.join('\n'));
          }
          
          if (previewBlocks.length > 0) {
            textToCopy = previewBlocks.join('\n\n');
          } else {
            textToCopy = stripMarkdown(this.data.previewContent);
          }
        } else {
          textToCopy = stripMarkdown(markdownContent);
        }
      }

      console.log('最终复制内容长度:', textToCopy.length);
      console.log('最终复制内容预览:', textToCopy.substring(0, 200));

      wx.hideLoading();

      // 检查内容是否为空
      if (!textToCopy || textToCopy.trim().length === 0) {
        wx.showToast({
          title: '没有可复制的内容',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 直接复制为纯文本
      wx.setClipboardData({
        data: textToCopy,
        success: () => {
          console.log('复制成功，内容长度:', textToCopy.length);
          wx.showToast({
            title: '内容已复制到剪贴板',
            icon: 'success',
            duration: 2000
          });
        },
        fail: (error) => {
          console.error('复制到剪贴板失败:', error);
          wx.showToast({
            title: '复制失败，请重试',
            icon: 'error'
          });
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('复制内容失败:', error);
      wx.showToast({
        title: '复制失败',
        icon: 'error'
      });
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 重新选择变式题（已移除，返回上一步重新选择）
  reselectVariants() {
    wx.navigateBack();
  }
});
