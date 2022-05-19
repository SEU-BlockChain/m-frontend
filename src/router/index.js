import {createRouter, createWebHistory} from 'vue-router'
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
        }
      },
      {
        path: "community",
        name: "Community",
        component: () => import("views/index/Community"),
        meta: {
          title: "社区",
          depth: 0,
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
        }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("views/index/Profile"),
        meta: {
          title: "我的",
          depth: 0,
        }
      },
    ]
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
    },
    children: [
      {
        path: "articles",
        name: "Articles",
        component: () => import("views/user_detail/Articles"),
      },
      {
        path: "comments",
        name: "Comments",
        component: () => import("views/user_detail/Comments"),
      },
      {
        path: "collections",
        name: "Collections",
        component: () => import("views/user_detail/Collections"),
      },
      {
        path: "stars",
        name: "Stars",
        component: () => import("views/user_detail/Stars"),
      }
    ]
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
      depth: 3
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
    path: "/settings",
    name: "Settings",
    component: () => import("views/settings/Settings"),
    meta: {
      title: "设置",
      depth: 1,
    }
  },
  {
    path: "/bbs",
    name: "Index",
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
