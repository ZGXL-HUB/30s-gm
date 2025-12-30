const XLSX = require('xlsx');

/**
 * 生成学生导入Excel模板
 */
function generateStudentTemplate() {
  // 创建模板数据
  const templateData = [
    ['姓名'],
    ['张三'],
    ['李四'],
    ['王五'],
    ['赵六']
  ];
  
  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  
  // 设置列宽
  const colWidths = [
    { wch: 15 } // 姓名
  ];
  worksheet['!cols'] = colWidths;
  
  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '学生信息');
  
  // 生成Excel文件
  const excelBuffer = XLSX.write(workbook, { 
    type: 'buffer', 
    bookType: 'xlsx' 
  });
  
  return excelBuffer;
}

module.exports = {
  generateStudentTemplate
};
