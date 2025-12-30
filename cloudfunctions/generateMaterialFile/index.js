const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { materialId, title, type, classAccuracy } = event;
  
  try {
    console.log('开始生成教学材料文件:', { materialId, title, type, classAccuracy });
    
    // 生成文件内容
    let fileContent;
    let fileName;
    let mimeType;
    
    if (type === 'ppt') {
      fileContent = generatePPTContent(title, classAccuracy);
      fileName = `${title}_${Date.now()}.pptx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (type === 'word') {
      fileContent = generateWordContent(title, classAccuracy);
      fileName = `${title}_${Date.now()}.docx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      return {
        success: false,
        message: '不支持的文件格式'
      };
    }
    
    // 上传到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: `materials/${fileName}`,
      fileContent: Buffer.from(fileContent, 'utf8')
    });
    
    console.log('文件上传成功:', uploadResult);
    
    // 获取下载链接
    const downloadUrl = await cloud.getTempFileURL({
      fileList: [uploadResult.fileID]
    });
    
    return {
      success: true,
      fileUrl: downloadUrl.fileList[0].tempFileURL,
      fileId: uploadResult.fileID,
      fileName: fileName,
      message: '文件生成成功'
    };
    
  } catch (error) {
    console.error('生成教学材料文件失败:', error);
    return {
      success: false,
      message: '生成文件失败: ' + error.message
    };
  }
};

// 生成PPT内容
function generatePPTContent(title, classAccuracy) {
  const content = `# ${title}

## 班级正确率统计
- 整体正确率: ${classAccuracy}%
- 需要重点讲解的知识点

## 练习题目

### 第一题
**题目**: 请选择正确的答案
**选项**:
A. 选项A
B. 选项B  
C. 选项C
D. 选项D

**答案**: A
**解析**: 这是正确答案的详细解析...

### 第二题
**题目**: 请选择正确的答案
**选项**:
A. 选项A
B. 选项B
C. 选项C  
D. 选项D

**答案**: C
**解析**: 这是正确答案的详细解析...

## 总结
- 本次练习主要考查的知识点
- 学生容易出错的地方
- 建议的复习重点

---
*生成时间: ${new Date().toLocaleString('zh-CN')}*
*班级正确率: ${classAccuracy}%*`;

  return content;
}

// 生成Word内容
function generateWordContent(title, classAccuracy) {
  const content = `# ${title}

## 教学材料

### 班级表现分析
本次练习的班级正确率为 **${classAccuracy}%**，整体表现${classAccuracy >= 80 ? '良好' : classAccuracy >= 60 ? '一般' : '需要加强'}。

### 练习内容

#### 练习一：语法选择题
1. 下列句子中，语法正确的是：
   A. 选项A
   B. 选项B
   C. 选项C
   D. 选项D
   
   **答案**: A
   **解析**: 详细解析内容...

2. 下列句子中，语法正确的是：
   A. 选项A
   B. 选项B
   C. 选项C
   D. 选项D
   
   **答案**: C
   **解析**: 详细解析内容...

### 教学建议
1. 重点讲解学生错误率较高的知识点
2. 加强相关语法规则的练习
3. 提供更多类似的练习题

### 课后作业
1. 完成相关语法练习
2. 复习本节课的重点内容
3. 预习下一课内容

---
**生成时间**: ${new Date().toLocaleString('zh-CN')}
**班级正确率**: ${classAccuracy}%
**材料类型**: 教学PPT/学案`;

  return content;
}
