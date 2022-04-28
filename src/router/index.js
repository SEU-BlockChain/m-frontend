import {createRouter, createWebHistory} from 'vue-router'
import store from "../store/index.js"

import IndexWrap from "wraps/IndexWrap";

const routes = [
  {
    path: "",
    component: IndexWrap,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("views/index/Home"),
        meta: {
          title: "首页",
          depth: 0,
        }
      },
      {
        path: "community",
        component: () => import("views/index/Community"),
        meta: {
          title: "社区",
          depth: 0,
        }
      },
      {
        path: "dynamic",
        component: () => import("views/index/Dynamic"),
        meta: {
          auth: 1,
          title: "动态",
          depth: 0,
        }
      },
      {
        path: "message",
        component: () => import("views/index/Message"),
        meta: {
          auth: 1,
          title: "消息",
          depth: 0,
        }
      },
      {
        path: "profile",
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
    component: () => import("wraps/UserDetailWrap"),
    redirect: "/user/articles",
    meta: {
      title: "我的主页",
      auth: 1,
      depth: 0,
    },
    children: [
      {
        path: "articles",
        component: () => import("views/user/Articles"),
      },
      {
        path: "comments",
        component: () => import("views/user/Comments"),
      },
      {
        path: "collections",
        component: () => import("views/user/Collections"),
      },
      {
        path: "stars",
        component: () => import("views/user/Stars"),
      }
    ]
  },
  {
    path: "/login",
    component: () => import("views/sign/Login"),
    meta: {
      auth: 0,
      title: "登录"
    }
  },
  {
    path: "/sign-up",
    component: () => import("views/sign/SignUp"),
    meta: {
      auth: 0,
      title: "注册"
    }
  },
  {
    path: "/reset-password",
    component: () => import("views/sign/ResetPassword"),
    meta: {
      auth: 0,
      title: "注册"
    }
  },
  {
    path: "/edit-info",
    component: () => import("views/single/EditInfo"),
    meta: {
      title: "账号资料",
      auth: 1,
      depth: 1,
    }
  },
  {
    path: "/settings",
    component: () => import("views/settings/Settings"),
    meta: {
      title: "设置",
      depth: 1,
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
