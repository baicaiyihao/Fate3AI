module.exports = {
  // ... other config ...
  unstable_runtimeJS: true,
  // 将这些路由标记为动态路由
  async generateStaticParams() {
    return {
      '/EVM': { dynamic: true },
      '/sync': { dynamic: true }
    }
  }
} 