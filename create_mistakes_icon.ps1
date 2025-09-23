# 为错题本创建图标的PowerShell脚本
# 基于question.svg创建错题本图标

# 设置图标尺寸
$size = 40

# 创建错题本图标的SVG内容（基于question.svg）
$mistakesSvg = @"
<svg width="$size" height="$size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="#888888"/>
</svg>
"@

$mistakesActiveSvg = @"
<svg width="$size" height="$size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="#667eea"/>
</svg>
"@

# 保存SVG文件
$mistakesSvg | Out-File -FilePath "mistakes.svg" -Encoding UTF8
$mistakesActiveSvg | Out-File -FilePath "mistakes-active.svg" -Encoding UTF8

Write-Host "✅ 错题本图标SVG文件已创建"
Write-Host "📁 文件位置: $(Get-Location)"
Write-Host "📝 请将SVG转换为PNG格式：mistakes.png 和 mistakes-active.png (40x40像素)"
Write-Host "📝 或者暂时使用现有的图标文件"
