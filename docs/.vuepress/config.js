module.exports = {
  title: '阿甘的博客',
  description: 'Just playing around',
  port: '8081',
  head: [
    ['link', { rel: 'icon', href: '/img/favicon.ico' }],
    ['meta', { name: 'keywords', content: '君哥聊编程,vuepress,自建博客,君哥' }]
  ],
  theme: 'reco',
  themeConfig: {
    // 左上角logo
    logo: '/img/logo.jpg',
    type: 'blog',
    smoothScroll: true,
    // 作者头像
    authorAvatar: '/avatar.png',
    // 最后更新时间
    lastUpdated: '2023-02-27',
    // 作者
    author: '阿甘',
    // 开始时间
    startYear: '2022',
    // 导航配置
    nav: [
      {
        text: "首页", link: '/', icon: 'reco-eye'
      },
      { 
        text: "技术分享", link: '/技术文章/',icon: 'reco-api',
        items: [
          {
            text: 'Vue',
            items: [
              {text: 'vue原理分析',link: '/技术文章/vue/vue原理分析'},
              {text: 'vue自定义指令', link: '/技术文章/vue/vue自定义指令'}
            ]
          }
        ]
      }
    ],
    // 自动形成侧边导航
		sidebar: 'auto',
    sidebarDepth: 2,
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 博客配置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "博客", // 默认文案“分类”
      },
      tag: {
        loaction: 3, // 在导航栏菜单中所占位置，默认3
        text: 'Tag', // 默认文案标签
      }
    },
    
  },
  markdown: {
      lineNumbers: true
  },
}