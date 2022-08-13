import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import store from "../store/index.js"

import IndexWrap from "wraps/IndexWrap";

const routes = [
  {
    path: "",
    name: "IndexWrap",
    component: IndexWrap,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("views/index/Home"),
        meta: {
          title: "首页",
          depth: 0,
          order: 0,
          keepAlive: true,
        }
      },
      {
        path: "community",
        name: "Community",
        component: () => import("views/index/Community"),
        meta: {
          title: "社区",
          depth: 0,
          order: 1,
          keepAlive: true,
        }
      },
      {
        path: "dynamic",
        name: "Dynamic",
        component: () => import("views/index/Dynamic"),
        meta: {
          auth: 1,
          title: "动态",
          depth: 0,
          order: 2,
          keepAlive: true,
        }
      },
      {
        path: "message",
        name: "Message",
        component: () => import("views/index/Message"),
        meta: {
          auth: 1,
          title: "消息",
          depth: 0,
          order: 3,
          keepAlive: true,
        }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("views/index/Profile"),
        meta: {
          title: "我的",
          depth: 0,
          order: 4,
          keepAlive: true,
        }
      },
    ]
  },
  {
    path: "/at",
    name: "At",
    meta: {
      title: "@我",
      auth: 1,
      depth: 1,
      keepAlive: true
    },
    component: () => import("views/message/At"),
  },
  {
    path: "/like",
    name: "Like",
    meta: {
      title: "收到的赞",
      auth: 1,
      depth: 1,
      keepAlive: true
    },
    component: () => import("views/message/Like"),
  },
  {
    path: "/reply",
    name: "Reply",
    meta: {
      title: "回复我的",
      auth: 1,
      depth: 1,
      keepAlive: true
    },
    component: () => import("views/message/Reply"),
  },
  {
    path: "/system",
    name: "System",
    meta: {
      title: "系统通知",
      auth: 1,
      depth: 1,
    },
    component: () => import("views/message/System"),
  },
  {
    path: "/chat/:id",
    name: "Chat",
    meta: {
      title: "对话详情",
      auth: 1,
      depth: 2,
    },
    component: () => import("views/message/Chat"),
  },

  {
    path: "/user",
    name: "UserDetailWrap",
    component: () => import("wraps/UserDetailWrap"),
    redirect: "/user/articles",
    meta: {
      title: "我的主页",
      auth: 1,
      depth: 1,
      keepAlive: true
    },
    children: [
      {
        path: "articles",
        name: "Articles",
        component: () => import("views/user_detail/Articles"),
        meta: {
          keepAlive: true,
          single: true
        }
      },
      {
        path: "comments",
        name: "Comments",
        component: () => import("views/user_detail/Comments"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "collections",
        name: "Collections",
        component: () => import("views/user_detail/Collections"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "stars",
        name: "Stars",
        component: () => import("views/user_detail/Stars"),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/user/level",
    name: "Level",
    meta: {
      title: "等级",
      auth: 1,
      depth: 4,
    },
    component: () => import("views/user_detail/Level"),
  },
  {
    path: "/user/follow",
    name: "Follow",
    meta: {
      title: "好友",
      auth: 1,
      depth: 2,
    },
    component: () => import("views/user_detail/Follow"),
  },
  {
    path: "/user/black-list",
    name: "BlackList",
    meta: {
      title: "黑名单",
      auth: 1,
      depth: 2,
    },
    component: () => import("views/user_detail/BlackList"),
  },
  {
    path: "/user/:id",
    name: "UserInfo",
    component: () => import("views/other_user/UserInfo"),
    meta: {
      title: "用户信息",
      depth: 3,
      keepAlive: true,
      none: true
    }
  },
  {
    path: "/edit-info",
    name: "EditInfo",
    component: () => import("views/user_detail/EditInfo"),
    meta: {
      title: "账号资料",
      auth: 1,
      depth: 4,
    }
  },
  {
    path: "/change-icon",
    name: "ChangeIcon",
    component: () => import("views/user_detail/ChangeIcon"),
    meta: {
      title: "修改头像",
      auth: 1,
      depth: 5,
    }
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("views/setting/Setting"),
    meta: {
      title: "设置",
      depth: 1,
    }
  },
  {
    path: "/setting/message",
    name: "MessageSetting",
    component: () => import("views/setting/MessageSetting"),
    meta: {
      title: "消息设置",
      depth: 2,
    }
  },
  {
    path: "/bbs",
    name: "Index-bbs",
    component: () => import("views/bbs/Index"),
    meta: {
      title: "讨论区",
      depth: 1,
      keepAlive: true
    }
  },
  {
    path: "/bbs/post-article",
    name: "PostArticle",
    component: () => import("views/bbs/PostArticle"),
    meta: {
      title: "发表文章",
      auth: 1,
      depth: 2
    }
  },
  {
    path: "/bbs/article/:id",
    name: "Article",
    component: () => import("views/bbs/Article"),
    meta: {
      title: "文章详情",
      depth: 2,
      keepAlive: true
    }
  },
  {
    path: "/special",
    name: "Index-special",
    component: () => import("views/special/Index"),
    meta: {
      title: "专栏",
      depth: 1,
      keepAlive: true
    }
  },
  {
    path: "/special/post-column",
    name: "PostColumn",
    component: () => import("views/special/PostColumn"),
    meta: {
      title: "发布专栏",
      auth: 1,
      depth: 2
    }
  },
  {
    path: "/special/column/:id",
    name: "Column",
    component: () => import("views/special/Column"),
    meta: {
      title: "专栏详情",
      depth: 2,
      keepAlive: true
    }
  },
  {
    path: "/information",
    name: "Index-information",
    component: () => import("views/information/Index"),
    meta: {
      title: "资讯",
      depth: 1,
      keepAlive: true
    }
  },
  {
    path: "/information/post-news",
    name: "PostNews",
    component: () => import("views/information/PostNews"),
    meta: {
      title: "发布资讯",
      auth: 1,
      depth: 2
    }
  },
  {
    path: "/information/news/:id",
    name: "News",
    component: () => import("views/information/News"),
    meta: {
      title: "资讯详情",
      depth: 2,
      keepAlive: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("views/sign/Login"),
    meta: {
      auth: 0,
      title: "登录"
    }
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("views/sign/SignUp"),
    meta: {
      auth: 0,
      title: "注册"
    }
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("views/sign/ResetPassword"),
    meta: {
      auth: 0,
      title: "重置密码"
    }
  },
  {
    path: "/eth/register",
    name: "EthRegister",
    component: () => import("views/eth/Register"),
    meta: {
      depth: 2,
      title: "注册以太坊账号"
    }
  },
  {
    path: "/eth/account",
    name: "EthAccount",
    component: () => import("views/eth/Account"),
    meta: {
      depth: 3,
      title: "账户详情"
    }
  },
  {
    path: "/eth/faucet",
    name: "EthFaucet",
    component: () => import("views/eth/Faucet"),
    meta: {
      depth: 3,
      title: "获取PMB"
    }
  },
  {
    path: "/issue/:address",
    name: "Issue",
    component: () => import("views/eth/Issue"),
    meta: {
      depth: 1,
      title: "预测详情"
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  let login = store.state.login
  let is_login = store.state.is_login
  if (to.meta.auth === 0) {
    if (is_login) {
      next(to.query.next || "/home")
    } else {
      if (!login) {
        next()
      } else {
        login.then(() => {
          next(to.query.next || "/home")
        }).catch(() => {
          next()
        })
      }
    }
  } else if (to.meta.auth === 1) {
    if (is_login) {
      next()
    } else {
      if (!login) {
        next({path: "/login", query: {next: to.path}})
      } else {
        login.then(() => {
          next()
        }).catch(() => {
          next({path: "/login", query: {next: to.path}})
        })
      }
    }
  } else {
    next()
  }
})

router.return = function (path) {
  return (!window.history.state.back && path) ? router.replace(path || "/home") : router.back()
}

export default router
