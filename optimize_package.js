const fs = require('fs');
const path = require('path');

// 分析当前包大小
function analyzePackageSize() {
  console.log('📊 当前包大小分析:');
  
  const miniprogramPath = path.join(__dirname, 'miniprogram');
  const dataPath = path.join(miniprogramPath, 'data');
  const pagesPath = path.join(miniprogramPath, 'pages');
  
  // 分析data目录
  const dataFiles = fs.readdirSync(dataPath);
  let totalDataSize = 0;
  
  dataFiles.forEach(file => {
    const filePath = path.join(dataPath, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    totalDataSize += stats.size;
    console.log(`  ${file}: ${sizeMB}MB`);
  });
  
  console.log(`  总数据大小: ${(totalDataSize / (1024 * 1024)).toFixed(2)}MB`);
  
  // 分析pages目录
  const pages = fs.readdirSync(pagesPath);
  let totalPagesSize = 0;
  
  pages.forEach(page => {
    const pagePath = path.join(pagesPath, page);
    const stats = fs.statSync(pagePath);
    totalPagesSize += stats.size;
  });
  
  console.log(`  Pages目录大小: ${(totalPagesSize / (1024 * 1024)).toFixed(2)}MB`);
}

// 生成数据迁移建议
function generateMigrationPlan() {
  console.log('\n🎯 数据迁移建议:');
  console.log('1. 将 intermediate_questions.js (1.4MB) 迁移到云数据库');
  console.log('2. 实现按需加载，按语法点分类获取数据');
  console.log('3. 使用云函数处理数据查询和过滤');
  console.log('4. 将不常用的页面改为分包加载');
}

// 生成优化后的数据结构
function generateOptimizedStructure() {
  console.log('\n📋 优化后的数据结构:');
  console.log('主包保留:');
  console.log('  - 核心页面 (index, grammar-writing, mistakes-page)');
  console.log('  - 基础工具函数');
  console.log('  - 小图标和样式');
  
  console.log('\n分包加载:');
  console.log('  - 规则页面 (noun-rules, tense-rules 等)');
  console.log('  - 示例页面 (examples, exampleDetail)');
  console.log('  - 用户中心相关页面');
  
  console.log('\n云数据库:');
  console.log('  - 题目数据 (按语法点分类)');
  console.log('  - 用户进度数据');
  console.log('  - 错题本数据');
}

// 生成app.json优化配置
function generateOptimizedAppJson() {
  const optimizedConfig = {
    pages: [
      "pages/index/index",
      "pages/grammar-writing/index", 
      "pages/mistakes-page/index"
    ],
    subpackages: [
      {
        root: "packageGrammar",
        pages: [
          "pages/grammar-select/index",
          "pages/grammar-overview/index",
          "pages/level-select/index",
          "pages/exercise-page/index"
        ]
      },
      {
        root: "packageRules", 
        pages: [
          "pages/noun-rules/index",
          "pages/tense-writing-rules/index",
          "pages/voice-rules/index",
          "pages/adjective-prefix-suffix-rules/index",
          "pages/comparison-writing-rules/index",
          "pages/adverb-writing-rules/index"
        ]
      },
      {
        root: "packageUser",
        pages: [
          "pages/user-center/index",
          "pages/custom-combo-setting/index",
          "pages/special-practice/index"
        ]
      }
    ],
    window: {
      backgroundColor: "#F6F6F6",
      backgroundTextStyle: "light", 
      navigationBarBackgroundColor: "#667eea",
      navigationBarTitleText: "语法练习",
      navigationBarTextStyle: "white"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/index/index",
          text: "语法练习",
          iconPath: "images/icons/home.png",
          selectedIconPath: "images/icons/home-active.png"
        },
        {
          pagePath: "pages/grammar-writing/index",
          text: "书写规范", 
          iconPath: "images/icons/business.png",
          selectedIconPath: "images/icons/business-active.png"
        },
        {
          pagePath: "pages/mistakes-page/index",
          text: "练错题",
          iconPath: "images/icons/goods.png", 
          selectedIconPath: "images/icons/goods-active.png"
        }
      ],
      color: "#888",
      selectedColor: "#667eea",
      backgroundColor: "#ffffff",
      borderStyle: "black"
    },
    sitemapLocation: "sitemap.json",
    style: "v2"
  };
  
  console.log('\n📝 优化后的app.json配置:');
  console.log(JSON.stringify(optimizedConfig, null, 2));
}

// 主函数
function main() {
  try {
    analyzePackageSize();
    generateMigrationPlan();
    generateOptimizedStructure();
    generateOptimizedAppJson();
    
    console.log('\n✅ 优化建议生成完成！');
    console.log('预计可减少主包大小: 1.4MB (数据文件) + 0.5MB (页面分包) = 1.9MB');
    console.log('优化后主包大小: 约 0.66MB');
  } catch (error) {
    console.error('❌ 分析失败:', error.message);
  }
}

main();
