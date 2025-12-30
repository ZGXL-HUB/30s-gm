// 实现手动输入学生姓名功能
// 这个文件包含了手动输入学生姓名的完整实现方案

/**
 * 手动输入学生姓名功能实现
 */
function implementManualStudentInput() {
  console.log('✍️ 实现手动输入学生姓名功能...');
  
  const implementationCode = `
  // 在 miniprogram/pages/teacher-class/index.js 中添加以下代码
  
  // 添加数据字段
  data: {
    // ... 现有字段 ...
    
    // 手动输入相关字段
    showManualInput: false,
    manualInputText: '',
    manualStudents: [],
    inputMode: 'text', // 'text' | 'paste'
    
    // 输入提示
    inputPlaceholder: '请输入学生姓名，每行一个\\n例如：\\n张小明\\n李小红\\n王小华'
  },
  
  // 显示手动输入弹窗
  showManualStudentInput() {
    this.setData({
      showManualInput: true,
      manualInputText: '',
      manualStudents: [],
      inputMode: 'text'
    });
  },
  
  // 关闭手动输入弹窗
  closeManualStudentInput() {
    this.setData({
      showManualInput: false,
      manualInputText: '',
      manualStudents: [],
      inputMode: 'text'
    });
  },
  
  // 输入文本变化
  onManualInputChange(e) {
    this.setData({
      manualInputText: e.detail.value
    });
  },
  
  // 从剪贴板粘贴
  async pasteFromClipboard() {
    try {
      const clipboardData = await wx.getClipboardData();
      this.setData({
        manualInputText: clipboardData.data,
        inputMode: 'paste'
      });
      
      wx.showToast({
        title: '已从剪贴板粘贴',
        icon: 'success'
      });
    } catch (error) {
      console.error('粘贴失败:', error);
      wx.showToast({
        title: '粘贴失败',
        icon: 'none'
      });
    }
  },
  
  // 解析输入的学生姓名
  parseManualStudents() {
    const text = this.data.manualInputText.trim();
    if (!text) {
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'none'
      });
      return;
    }
    
    // 按行分割并过滤空行
    const lines = text.split(/[\\n\\r]+/).filter(line => line.trim());
    
    // 验证学生姓名
    const students = [];
    const errors = [];
    
    lines.forEach((line, index) => {
      const name = line.trim();
      
      if (!name) {
        return; // 跳过空行
      }
      
      // 验证姓名格式
      if (name.length < 1 || name.length > 20) {
        errors.push(\`第\${index + 1}行：姓名长度必须在1-20个字符之间\`);
        return;
      }
      
      if (/[0-9]/.test(name)) {
        errors.push(\`第\${index + 1}行：姓名不能包含数字\`);
        return;
      }
      
      if (/[^\\u4e00-\\u9fa5a-zA-Z]/.test(name)) {
        errors.push(\`第\${index + 1}行：姓名只能包含中文和英文字母\`);
        return;
      }
      
      students.push({
        name: name,
        rowIndex: index + 1
      });
    });
    
    if (errors.length > 0) {
      wx.showModal({
        title: '输入格式错误',
        content: errors.join('\\n'),
        showCancel: false
      });
      return;
    }
    
    if (students.length === 0) {
      wx.showToast({
        title: '没有找到有效的学生姓名',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      manualStudents: students
    });
    
    wx.showModal({
      title: '确认学生名单',
      content: \`找到 \${students.length} 个学生：\\n\${students.map(s => s.name).join('、')}\`,
      confirmText: '确认导入',
      cancelText: '重新输入',
      success: (res) => {
        if (res.confirm) {
          this.confirmManualImport();
        }
      }
    });
  },
  
  // 确认手动导入
  async confirmManualImport() {
    try {
      wx.showLoading({
        title: '导入中...'
      });
      
      const classId = this.data.currentClassId; // 需要先设置当前班级ID
      const teacherId = wx.getStorageSync('teacherId') || 'teacher_123';
      
      if (!classId) {
        throw new Error('班级ID不存在');
      }
      
      // 保存学生数据到数据库
      const db = wx.cloud.database();
      const savedStudents = [];
      
      for (const student of this.data.manualStudents) {
        try {
          const result = await db.collection('students').add({
            data: {
              name: student.name,
              classId: classId,
              class: this.data.classes.find(c => c.id === classId)?.name || '未知班级',
              teacherId: teacherId,
              status: 'active',
              createdAt: new Date(),
              lastActivity: new Date()
            }
          });
          
          savedStudents.push({
            id: result._id,
            name: student.name
          });
        } catch (saveError) {
          console.error('保存学生失败:', student.name, saveError);
        }
      }
      
      // 更新班级学生人数
      await db.collection('classes').doc(classId).update({
        data: {
          studentCount: savedStudents.length,
          lastActivity: new Date()
        }
      });
      
      // 更新本地存储
      const existingStudents = wx.getStorageSync(\`teacher_students_\${teacherId}\`) || [];
      const newStudents = savedStudents.map(s => ({
        id: s.id,
        name: s.name,
        classId: classId,
        class: this.data.classes.find(c => c.id === classId)?.name || '未知班级',
        teacherId: teacherId,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }));
      
      const updatedStudents = [...existingStudents, ...newStudents];
      wx.setStorageSync(\`teacher_students_\${teacherId}\`, updatedStudents);
      
      // 更新页面数据
      this.setData({
        students: updatedStudents
      });
      
      wx.hideLoading();
      
      this.closeManualStudentInput();
      
      wx.showToast({
        title: \`成功导入 \${savedStudents.length} 名学生\`,
        icon: 'success'
      });
      
      console.log('手动导入成功:', savedStudents);
      
    } catch (error) {
      console.error('手动导入失败:', error);
      wx.hideLoading();
      
      wx.showToast({
        title: '导入失败',
        icon: 'none'
      });
    }
  },
  
  // 设置当前班级ID（在点击班级时调用）
  setCurrentClassId(classId) {
    this.setData({
      currentClassId: classId
    });
  }
  `;
  
  console.log('手动输入学生姓名功能实现:');
  console.log(implementationCode);
  
  return implementationCode;
}

/**
 * 创建手动输入界面WXML代码
 */
function createManualInputWXML() {
  console.log('🎨 创建手动输入界面WXML代码...');
  
  const wxmlCode = `
  <!-- 手动输入学生姓名弹窗 -->
  <view class="modal-overlay" wx:if="{{showManualInput}}">
    <view class="modal manual-input-modal">
      <view class="modal-header">
        <text class="modal-title">手动输入学生姓名</text>
        <text class="modal-close" bindtap="closeManualStudentInput">×</text>
      </view>
      
      <view class="modal-body">
        <!-- 输入提示 -->
        <view class="input-tip">
          <text class="tip-text">请输入学生姓名，每行一个</text>
          <text class="tip-example">例如：\\n张小明\\n李小红\\n王小华</text>
        </view>
        
        <!-- 输入区域 -->
        <view class="input-area">
          <textarea 
            class="student-input"
            placeholder="{{inputPlaceholder}}"
            value="{{manualInputText}}"
            bindinput="onManualInputChange"
            auto-height
            maxlength="1000"
          ></textarea>
        </view>
        
        <!-- 操作按钮 -->
        <view class="input-actions">
          <button class="btn btn-secondary" bindtap="pasteFromClipboard">
            <text class="btn-icon">📋</text>
            从剪贴板粘贴
          </button>
          <button class="btn btn-primary" bindtap="parseManualStudents">
            <text class="btn-icon">✓</text>
            解析学生名单
          </button>
        </view>
        
        <!-- 预览区域 -->
        <view class="preview-area" wx:if="{{manualStudents.length > 0}}">
          <text class="preview-title">预览结果：</text>
          <view class="student-preview">
            <text 
              class="student-item"
              wx:for="{{manualStudents}}"
              wx:key="rowIndex"
            >
              {{item.rowIndex}}. {{item.name}}
            </text>
          </view>
        </view>
      </view>
      
      <view class="modal-footer">
        <button class="btn btn-secondary" bindtap="closeManualStudentInput">取消</button>
        <button 
          class="btn btn-primary" 
          bindtap="confirmManualImport"
          wx:if="{{manualStudents.length > 0}}"
        >
          确认导入 ({{manualStudents.length}}人)
        </button>
      </view>
    </view>
  </view>
  `;
  
  console.log('手动输入界面WXML代码:');
  console.log(wxmlCode);
  
  return wxmlCode;
}

/**
 * 创建手动输入界面样式
 */
function createManualInputStyles() {
  console.log('💄 创建手动输入界面样式...');
  
  const stylesCode = `
  /* 手动输入弹窗样式 */
  .manual-input-modal {
    max-width: 90%;
    max-height: 80vh;
  }
  
  .manual-input-modal .modal-body {
    padding: 32rpx;
  }
  
  /* 输入提示 */
  .input-tip {
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
  }
  
  .tip-text {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .tip-example {
    display: block;
    font-size: 22rpx;
    color: #666;
    white-space: pre-line;
  }
  
  /* 输入区域 */
  .input-area {
    margin-bottom: 24rpx;
  }
  
  .student-input {
    width: 100%;
    min-height: 200rpx;
    padding: 20rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 28rpx;
    line-height: 1.5;
    background: #fff;
  }
  
  .student-input:focus {
    border-color: #667eea;
  }
  
  /* 操作按钮 */
  .input-actions {
    display: flex;
    gap: 16rpx;
    margin-bottom: 24rpx;
  }
  
  .input-actions .btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
  }
  
  .btn-icon {
    font-size: 24rpx;
  }
  
  /* 预览区域 */
  .preview-area {
    background: #f0f8ff;
    border-radius: 12rpx;
    padding: 20rpx;
  }
  
  .preview-title {
    display: block;
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .student-preview {
    max-height: 200rpx;
    overflow-y: auto;
  }
  
  .student-item {
    display: block;
    font-size: 24rpx;
    color: #555;
    padding: 8rpx 0;
    border-bottom: 1rpx solid #e0e0e0;
  }
  
  .student-item:last-child {
    border-bottom: none;
  }
  `;
  
  console.log('手动输入界面样式:');
  console.log(stylesCode);
  
  return stylesCode;
}

/**
 * 创建使用说明文档
 */
function createUsageGuide() {
  console.log('📖 创建使用说明文档...');
  
  const usageGuide = `
  # 手动输入学生姓名功能使用说明
  
  ## 功能概述
  手动输入学生姓名功能允许用户通过文本输入的方式批量添加学生，支持以下特性：
  
  ## 主要功能
  1. **文本输入** - 直接在文本框中输入学生姓名
  2. **剪贴板粘贴** - 从剪贴板粘贴学生名单
  3. **格式验证** - 自动验证学生姓名格式
  4. **实时预览** - 实时显示解析结果
  5. **批量导入** - 一次性导入多个学生
  
  ## 使用方法
  
  ### 方法1：直接输入
  1. 点击"手动输入学生姓名"按钮
  2. 在文本框中输入学生姓名，每行一个
  3. 点击"解析学生名单"按钮
  4. 确认预览结果后点击"确认导入"
  
  ### 方法2：剪贴板粘贴
  1. 复制包含学生姓名的文本
  2. 点击"从剪贴板粘贴"按钮
  3. 点击"解析学生名单"按钮
  4. 确认预览结果后点击"确认导入"
  
  ## 输入格式要求
  
  ### 支持的格式
  - 每行一个学生姓名
  - 支持中文和英文字母
  - 姓名长度1-20个字符
  - 自动忽略空行
  
  ### 示例格式
  ```
  张小明
  李小红
  王小华
  赵小丽
  陈小强
  ```
  
  ### 不支持的格式
  - 包含数字的姓名（如：学生1、学生2）
  - 包含特殊字符的姓名
  - 空姓名或过长姓名
  
  ## 注意事项
  1. 确保每个学生姓名独占一行
  2. 避免使用数字和特殊字符
  3. 建议使用真实的学生姓名
  4. 导入前请仔细检查预览结果
  
  ## 错误处理
  - 如果输入格式有误，系统会显示具体的错误信息
  - 可以根据错误提示修改输入内容
  - 支持重新输入和重新解析
  `;
  
  console.log('使用说明文档:');
  console.log(usageGuide);
  
  return usageGuide;
}

// 执行所有实现方案
function executeManualInputImplementation() {
  console.log('🚀 执行手动输入学生姓名功能实现方案...');
  console.log('');
  
  implementManualStudentInput();
  console.log('');
  
  createManualInputWXML();
  console.log('');
  
  createManualInputStyles();
  console.log('');
  
  createUsageGuide();
  console.log('');
  
  console.log('📋 实现方案总结:');
  console.log('✅ 1. 提供了完整的手动输入功能实现');
  console.log('✅ 2. 支持文本输入和剪贴板粘贴');
  console.log('✅ 3. 包含学生姓名格式验证');
  console.log('✅ 4. 提供实时预览功能');
  console.log('✅ 5. 包含完整的UI界面设计');
  console.log('');
  console.log('🔧 实施步骤:');
  console.log('1. 将JavaScript代码添加到index.js');
  console.log('2. 将WXML代码添加到index.wxml');
  console.log('3. 将样式代码添加到index.wxss');
  console.log('4. 在班级管理界面添加"手动输入"按钮');
  console.log('5. 测试手动输入功能');
}

// 导出函数
window.executeManualInputImplementation = executeManualInputImplementation;
