import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  css: {
    //* css模块化
    // modules: { // css模块化 文件以.module.[css|less|scss]结尾
    //   generateScopedName: '[name]__[local]___[hash:base64:5]',
    //   hashPrefix: 'prefix',
    // },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 允许在 Less 中使用 JavaScript 表达式
        globalVars: {
          // 全局变量
        }
      },
    }
  },
  build: {
    lib: {
      // 入口文件将包含可以由你的包的用户导入的导出：
      entry: resolve(__dirname, "src/index.ts"),
      name: "yodao-ui",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      // external: ["react", "react-dom", "antd"],
      external: ["react", "react-dom", "moment", "lodash", "classnames", "react-selectable-fast", "calendar"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: "React",
          "react-dom": "react-dom",
          moment: "moment",
          lodash: "_",
          classnames: "classnames",
          "react-selectable-fast": "reactSelectableFast",
          calendar: "calendar",
        },
      },
    },
  },
});