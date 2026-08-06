import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 关键！告诉 Next.js 生成纯静态 HTML 文件
  trailingSlash: true, // 兼容某些静态服务器的路由规则
  images: {
    unoptimized: true, // 关键！静态导出时，图片不能被 Next.js 实时优化，需要关闭
  },
};

export default nextConfig;