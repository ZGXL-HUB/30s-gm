-- MVP阶段数据库设计
-- 基于现有云数据库结构扩展

-- 1. 作业表 (assignments)
-- 存储教师创建的作业信息
CREATE TABLE assignments (
  _id VARCHAR(50) PRIMARY KEY,
  teacherId VARCHAR(50) NOT NULL COMMENT '教师ID',
  title VARCHAR(200) NOT NULL COMMENT '作业标题',
  description TEXT COMMENT '作业描述',
  questions JSON NOT NULL COMMENT '题目ID数组',
  deadline DATETIME NOT NULL COMMENT '截止时间',
  status ENUM('active', 'completed', 'expired') DEFAULT 'active' COMMENT '作业状态',
  variantMode ENUM('auto', 'manual', 'none') DEFAULT 'auto' COMMENT '变式题模式',
  variantRules JSON COMMENT '变式题规则配置',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_teacherId (teacherId),
  INDEX idx_deadline (deadline),
  INDEX idx_status (status)
);

-- 2. 作业结果表 (assignment_results)
-- 存储学生提交的作业结果
CREATE TABLE assignment_results (
  _id VARCHAR(50) PRIMARY KEY,
  assignmentId VARCHAR(50) NOT NULL COMMENT '作业ID',
  studentId VARCHAR(50) NOT NULL COMMENT '学生ID',
  answers JSON NOT NULL COMMENT '学生答案数组',
  correctAnswers JSON NOT NULL COMMENT '正确答案数组',
  score INT NOT NULL DEFAULT 0 COMMENT '得分',
  totalScore INT NOT NULL DEFAULT 0 COMMENT '总分',
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '正确率',
  wrongQuestions JSON COMMENT '错题ID数组',
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_assignmentId (assignmentId),
  INDEX idx_studentId (studentId),
  INDEX idx_submittedAt (submittedAt)
);

-- 3. 变式题规则表 (variant_rules)
-- 存储变式题生成规则
CREATE TABLE variant_rules (
  _id VARCHAR(50) PRIMARY KEY,
  assignmentId VARCHAR(50) NOT NULL COMMENT '作业ID',
  rules JSON NOT NULL COMMENT '变式题规则配置',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_assignmentId (assignmentId)
);

-- 4. 导出记录表 (export_records)
-- 存储PPT/Word导出记录
CREATE TABLE export_records (
  _id VARCHAR(50) PRIMARY KEY,
  teacherId VARCHAR(50) NOT NULL COMMENT '教师ID',
  assignmentId VARCHAR(50) COMMENT '作业ID',
  fileName VARCHAR(200) NOT NULL COMMENT '文件名',
  fileType ENUM('ppt', 'word') NOT NULL COMMENT '文件类型',
  fileSize INT COMMENT '文件大小(字节)',
  downloadUrl VARCHAR(500) COMMENT '下载链接',
  content JSON COMMENT '导出内容元数据',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_teacherId (teacherId),
  INDEX idx_assignmentId (assignmentId),
  INDEX idx_fileType (fileType)
);

-- 5. 语法点历史表 (grammar_point_history)
-- 存储语法点布置历史统计
CREATE TABLE grammar_point_history (
  _id VARCHAR(50) PRIMARY KEY,
  grammarPoint VARCHAR(100) NOT NULL COMMENT '语法点名称',
  teacherId VARCHAR(50) NOT NULL COMMENT '教师ID',
  lastAssigned DATETIME NOT NULL COMMENT '上次布置时间',
  averageAccuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '平均正确率',
  practiceCount INT NOT NULL DEFAULT 0 COMMENT '练习次数',
  trend ENUM('improving', 'stable', 'declining') DEFAULT 'stable' COMMENT '趋势',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_grammarPoint (grammarPoint),
  INDEX idx_teacherId (teacherId),
  INDEX idx_lastAssigned (lastAssigned)
);

-- 6. 题目讲解表 (question_explanations)
-- 存储教师录入的题目讲解
CREATE TABLE question_explanations (
  _id VARCHAR(50) PRIMARY KEY,
  questionId VARCHAR(50) NOT NULL COMMENT '题目ID',
  teacherId VARCHAR(50) NOT NULL COMMENT '教师ID',
  explanation TEXT COMMENT '文字讲解',
  audioUrl VARCHAR(500) COMMENT '语音讲解URL',
  videoUrl VARCHAR(500) COMMENT '视频讲解URL',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_questionId (questionId),
  INDEX idx_teacherId (teacherId)
);

-- 7. 学生错题表 (student_mistakes) - 扩展现有表
-- 存储学生错题历史，按语法点分类
ALTER TABLE student_mistakes 
ADD COLUMN grammarPoint VARCHAR(100) COMMENT '语法点分类',
ADD COLUMN week INT COMMENT '周数',
ADD COLUMN timestamp BIGINT COMMENT '时间戳',
ADD INDEX idx_grammarPoint (grammarPoint),
ADD INDEX idx_timestamp (timestamp);

-- 8. 教师用户表 (teachers) - 新增
-- 存储教师用户信息
CREATE TABLE teachers (
  _id VARCHAR(50) PRIMARY KEY,
  openId VARCHAR(100) NOT NULL UNIQUE COMMENT '微信OpenID',
  name VARCHAR(50) NOT NULL COMMENT '教师姓名',
  school VARCHAR(100) COMMENT '学校名称',
  grade VARCHAR(20) COMMENT '年级',
  subject VARCHAR(50) COMMENT '学科',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openId (openId),
  INDEX idx_status (status)
);

-- 9. 学生用户表 (students) - 新增
-- 存储学生用户信息
CREATE TABLE students (
  _id VARCHAR(50) PRIMARY KEY,
  openId VARCHAR(100) NOT NULL UNIQUE COMMENT '微信OpenID',
  name VARCHAR(50) NOT NULL COMMENT '学生姓名',
  school VARCHAR(100) COMMENT '学校名称',
  grade VARCHAR(20) COMMENT '年级',
  class VARCHAR(50) COMMENT '班级',
  teacherId VARCHAR(50) COMMENT '关联教师ID',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openId (openId),
  INDEX idx_teacherId (teacherId),
  INDEX idx_status (status)
);
