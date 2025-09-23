# 内容迁移和存储策略

## 1. 文件存储结构

### 新内容存储(当前创建的文件)
```
preposition_complete_data.json     # 完整的新数据结构
preposition_complete_content.md    # 完整的新内容展示
preposition_tables.md             # 纯表格内容(交互练习用)
```

### 建议的备份和迁移结构
```
backup/
├── original_content/             # 原有内容的备份
│   ├── writing_rules_notes/      # 原有笔记备份
│   └── writing_rules_tables/     # 原有表格备份
├── new_content/                  # 新内容存储
│   ├── preposition/              # 介词相关内容
│   ├── pronoun/                  # 代词相关内容(未来)
│   └── conjunction/              # 连词相关内容(未来)
└── migration_log/                # 迁移日志
    └── migration_timeline.md     # 迁移时间线
```

## 2. 命名规范

### 新内容命名规范
- **笔记ID**: `{category}_note_{version}_{subcategory}`
  - 例如: `preposition_note_v2_001` (v2表示新版本)
- **表格ID**: `{category}_table_{version}_{subcategory}`
  - 例如: `preposition_table_v2_001`
- **练习表格ID**: `{category}_practice_{version}_{subcategory}`
  - 例如: `preposition_practice_v2_001`

### 原有内容保留
- 保持原有ID不变，添加状态标记
- 例如: `status: "deprecated"` 或 `status: "migrated"`

## 3. 迁移策略

### 阶段1: 内容备份
1. 备份所有原有内容到 `backup/original_content/`
2. 创建迁移日志记录

### 阶段2: 新内容部署
1. 先部署新内容，使用新的命名空间
2. 保持原有内容不变
3. 在UI中添加版本切换功能

### 阶段3: 逐步迁移
1. 按语法点逐步迁移(介词 → 代词 → 连词...)
2. 每个语法点迁移完成后，标记原有内容为deprecated
3. 保留原有内容作为参考

### 阶段4: 内容清理
1. 确认新内容完全稳定后
2. 将deprecated内容移动到archive
3. 更新所有引用

## 4. 应用注意事项

### 数据库操作
- 使用事务确保数据一致性
- 创建迁移脚本，支持回滚
- 保留原有数据的完整备份

### 前端应用
- 添加版本控制机制
- 支持新旧内容切换
- 保持向后兼容性

### 用户体验
- 提供内容对比功能
- 显示迁移进度
- 收集用户反馈

## 5. 具体实施步骤

### 第一步：创建备份
```javascript
// 备份原有内容
const backupOriginalContent = async () => {
  // 备份笔记
  // 备份表格
  // 创建备份记录
}
```

### 第二步：部署新内容
```javascript
// 部署新内容
const deployNewContent = async () => {
  // 使用新的命名空间
  // 保持原有内容不变
  // 添加版本标记
}
```

### 第三步：迁移验证
```javascript
// 验证迁移结果
const validateMigration = async () => {
  // 检查数据完整性
  // 验证功能正常
  // 用户测试反馈
}
```

## 6. 风险控制

### 数据安全
- 多重备份策略
- 版本控制
- 回滚机制

### 功能稳定
- 分阶段部署
- A/B测试
- 灰度发布

### 用户体验
- 平滑过渡
- 功能说明
- 反馈收集 