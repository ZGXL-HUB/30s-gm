-- 班级邀请码系统数据库扩展
-- 扩展现有的classes表结构

-- 1. 更新classes表，添加邀请码相关字段
ALTER TABLE classes ADD COLUMN inviteCode VARCHAR(20) UNIQUE COMMENT '班级邀请码';
ALTER TABLE classes ADD COLUMN inviteCodeExpiry DATETIME COMMENT '邀请码过期时间';
ALTER TABLE classes ADD COLUMN maxStudents INT DEFAULT 50 COMMENT '班级最大人数';
ALTER TABLE classes ADD COLUMN currentStudents INT DEFAULT 0 COMMENT '当前学生人数';
ALTER TABLE classes ADD COLUMN joinMethod ENUM('invite_only', 'direct_only', 'both') DEFAULT 'both' COMMENT '加入方式';

-- 2. 更新students表，添加加入方式记录
ALTER TABLE students ADD COLUMN joinMethod ENUM('invite', 'direct', 'transfer') DEFAULT 'direct' COMMENT '加入方式';
ALTER TABLE students ADD COLUMN joinedAt DATETIME COMMENT '加入班级时间';
ALTER TABLE students ADD COLUMN previousClassId VARCHAR(50) COMMENT '之前班级ID（转班记录）';

-- 3. 创建班级邀请记录表
CREATE TABLE class_invitations (
  _id VARCHAR(50) PRIMARY KEY,
  classId VARCHAR(50) NOT NULL COMMENT '班级ID',
  teacherId VARCHAR(50) NOT NULL COMMENT '教师ID',
  inviteCode VARCHAR(20) NOT NULL COMMENT '邀请码',
  createdBy VARCHAR(50) NOT NULL COMMENT '创建者OpenID',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  expiresAt DATETIME NOT NULL COMMENT '过期时间',
  isActive BOOLEAN DEFAULT TRUE COMMENT '是否有效',
  usedCount INT DEFAULT 0 COMMENT '使用次数',
  maxUses INT DEFAULT -1 COMMENT '最大使用次数(-1表示无限制)',
  INDEX idx_classId (classId),
  INDEX idx_inviteCode (inviteCode),
  INDEX idx_teacherId (teacherId)
);

-- 4. 创建学生加入记录表
CREATE TABLE student_join_records (
  _id VARCHAR(50) PRIMARY KEY,
  studentId VARCHAR(50) NOT NULL COMMENT '学生ID',
  classId VARCHAR(50) NOT NULL COMMENT '班级ID',
  teacherId VARCHAR(50) NOT NULL COMMENT '教师ID',
  joinMethod ENUM('invite', 'direct', 'transfer') NOT NULL COMMENT '加入方式',
  inviteCode VARCHAR(20) COMMENT '使用的邀请码',
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  leftAt DATETIME COMMENT '离开时间',
  isActive BOOLEAN DEFAULT TRUE COMMENT '是否有效',
  INDEX idx_studentId (studentId),
  INDEX idx_classId (classId),
  INDEX idx_teacherId (teacherId)
);

-- 5. 为现有数据设置默认值
UPDATE classes SET 
  inviteCode = CONCAT('CLASS', LPAD(CAST(SUBSTRING(_id, -6) AS UNSIGNED), 6, '0')),
  inviteCodeExpiry = DATE_ADD(NOW(), INTERVAL 30 DAY),
  currentStudents = (
    SELECT COUNT(*) FROM students 
    WHERE students.classId = classes._id AND students.status = 'active'
  )
WHERE inviteCode IS NULL;
