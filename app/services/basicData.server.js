//基本配置数据
module.exports = {
  login:{
    username:"admin",
    password:"admin"
  },
  // LifeStyleIndex:{
  //   catalogueName:"LifeStyle",
  //   catalogueCNName:"提笔随心",
  //   catalogueENName:"LifeStyle",
  //   catalogueID:"0",
  //   catalogueIconClass:"fa-map-signs",
  //   column:[
  //     {
  //       name: "最近更新",
  //       uiUrl: "LifeStyle.articleList"
  //     },
  //     {
  //       name: "时间轴",
  //       uiUrl: "LifeStyle.historyList"
  //     },
  //     {
  //       name: "标签库",
  //       uiUrl: "LifeStyle.tagList"
  //     }
  //   ]
  // },
  FrontEndIndex:{
    catalogueName:"Blog",
    catalogueCNName:"我的博客",
    catalogueENName:"Blog",
    // catalogueID:"1",
    // catalogueIconClass:"fa-html5",
    column:[
      {
        name: "最近更新",
        uiUrl: "blog.articleList"
      },
      {
        name: "时间轴",
        uiUrl: "blog.historyList"
      },
      {
        name: "标签库",
        uiUrl: "blog.tagList"
      }
    ]
  }
};