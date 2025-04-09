export const theme = {
  // 浅色主题
  light: {
    background: '#FFFFFF',
    textColor: '#2D3748',
    buttonGradient: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
    cardShadow: '0px 4px 12px rgba(160, 174, 192, 0.15)',
    borderColor: '#E2E8F0',
    inputBackground: '#F7FAFC'
  },
  // 保留深色主题以备后续扩展
  dark: {
    background: '#1F1F1F',
    textColor: '#FFFFFF',
    buttonGradient: 'linear-gradient(90deg, #27AE60 0%, #2ECC71 100%)',
    cardShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderColor: '#3E3E3E',
    inputBackground: '#2F2F2F'
  }
};

export default theme.light; // 默认使用浅色主题