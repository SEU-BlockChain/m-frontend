import store from "../../store/index"

function follow(request, user, tip) {
  request.api.post(
    `user/follow/${user.id}/add/`
  ).then(res => {
    if (res.data.code === 128) {
      user.followed = true
      user.fans_num++
      tip({
        content: "已关注",
        type: "success",
        duration: 1000
      })
    } else {
      tip({
        content: res.data.msg,
        type: "warning",
        duration: 1000
      })
    }
  })
}

function not_follow(request, user, tip, dialog) {
  dialog("是否取消关注").then(res => {
    if (res !== "confirm") return;
    request.api.post(
      `user/follow/${user.id}/remove/`
    ).then(res => {
      if (res.data.code === 129) {
        user.followed = false
        user.fans_num--
        tip({
          content: "已取消关注",
          type: "success",
          duration: 1000
        })
      } else {
        tip({
          content: res.data.msg,
          type: "warning",
          duration: 1000
        })
      }
    })
  })
}

function black(request, user, tip) {
  request.api.post(
    `user/black_list/`,
    {
      id: user.id
    }
  ).then(res => {
    if (res.data.code === 132) {
      user.not_blacked = false
      tip({
        content: "已拉黑",
        type: "success",
        duration: 1000
      })
    } else {
      tip({
        content: res.data.msg,
        type: "warning",
        duration: 1000
      })
    }
  })
}

function not_black(request, user, tip, dialog) {
  dialog("是否取消拉黑").then(res => {
    if (res !== "confirm") return;
    request.api.delete(
      `user/black_list/${user.id}/`
    ).then(res => {
      if (res.data.code === 133) {
        user.not_blacked = true
        tip({
          content: "已取消拉黑",
          type: "success",
          duration: 1000
        })
      } else {
        tip({
          content: res.data.msg,
          type: "warning",
          duration: 1000
        })
      }
    })
  })
}

function downloadImage(url) {
  let img = new Image;
  img.setAttribute("crossOrigin", 'Anonymous')
  img.src = url
  img.onload = function () {
    let cvs = document.createElement("canvas")
    cvs.width = img.width
    cvs.height = img.height
    let ctx = cvs.getContext("2d")
    ctx.drawImage(img, 0, 0)
    cvs.toBlob(data => {
      let aTag = document.createElement('a');
      aTag.download = (new URL(url)).pathname;
      aTag.href = URL.createObjectURL(data);
      aTag.click();
    })
  }
}


function mutex(show, callback) {
  if (show) {
    store.commit("pushStack", callback)
  } else {
    if (store.state.stack_locked) {
      store.commit("unlockStack")
    } else {
      store.commit("cancelStack")
    }
  }
}

export default {
  follow,
  not_follow,
  black,
  not_black,
  downloadImage,
  mutex,
}
