<template>
  <div class="Mine">
    <van-nav-bar title="个人中心" left-text="返回" left-arrow @click-left="jumpHome" />
    <header class="mine_header">
      <div class="bg">
        <img
          src="http://127.0.0.1:3000/images/bgmCovers/TIM20190807103957.jpg"
          alt="bg"
          width="100%"
          height="180px"
        />
      </div>
      <uploader upload-text="上传头像" :after-read="afterRead">
        <input class="avatar" type="image" :src="avatar" />
      </uploader>
      <h6 class="nickname">{{nickname}}</h6>
      <uploader :after-read="afterSelected" :max-size="524288000">
        <button class="upload_video_btn">上传视频</button>
      </uploader>
      <span class="logout_btn" @click="logout">注销</span>
    </header>
    <div class="my_nav">
      <ul class="nav_ul">
        <div class="nav_t_li">
          <div class="nav_t_box" @click="toPraise(0)">
            <div class="nav_i_box">
              <i class="iconfont icon-aixin">&#xe6d6;</i>
            </div>
            <h6>赞</h6>
          </div>
          <div class="nav_t_box" @click="toPraise(1)">
            <div class="nav_i_box nav_i_bg2">
              <i class="iconfont icon-liuyan">&#xe62c;</i>
            </div>
            <h6>评论</h6>
          </div>
        </div>
      </ul>
    </div>
    <van-tabs type="card" color="#a6c1ee" animated swipeable :lazy-render="false">
      <van-tab title="作品">
        <div class="works_wrapper" ref="workswrapper">
          <ul class="author_video" v-if="worksList.length">
            <li class="author_video_li" v-for="(item) in worksList" :key="item.id">
              <div>
                <div class="author_video_bg ui-flex justify-center center">
                  <img :src="item.cover_path" class="author_video_img" />
                </div>
                <img class="bo_icon" src="./../../assets/images/icon_play.png" />
                <div class="author_video_li_bottom">
                  <i class="iconfont icon-xin">&#xe689;</i>
                  {{item.like_counts}}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="no_message" v-if="!worksList.length">
          <i class="iconfont iconfont_style icon-rss">&#xe602;</i>
          <div class="no_message_tips">暂无作品</div>
        </div>
      </van-tab>
      <van-tab title="收藏">
        <div class="favors_wrapper" ref="favorswrapper" v-if="favorsList.length">
          <ul class="author_video content">
            <li class="author_video_li" v-for="(item) in favorsList" :key="item.id">
              <div>
                <div class="author_video_bg ui-flex justify-center center">
                  <img :src="item.cover_path" class="author_video_img" />
                </div>
                <img class="bo_icon" src="./../../assets/images/icon_play.png" />
                <div class="author_video_li_bottom">
                  <i class="iconfont icon-xin">&#xe689;</i>
                  {{item.like_counts}}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="no_message" v-if="!favorsList.length">
          <i class="iconfont iconfont_style icon-rss">&#xe601;</i>
          <div class="no_message_tips">暂无收藏</div>
        </div>
      </van-tab>
      <van-tab title="关注">
        <div class="users_wrapper" ref="userswrapper" v-if="usersList.length">
          <ul class="users_ul content">
            <li class="users_li" v-for="(item) in usersList" :key="item.id">
              <img :src="item.avatar" alt="subscriber" class="user_avatar" />
              <span class="nickname">{{item.nickname}}</span>
              <i class="iconfont follow" :class="hasFollow?'follow_active':''" @click="follow(item)">&#xe689;</i>
              <van-divider></van-divider>
            </li>
          </ul>
        </div>
        <div class="no_message" v-if="!usersList.length">
          <i class="iconfont iconfont_style icon-rss">&#xe67c;</i>
          <div class="no_message_tips">暂无关注</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Uploader, Button, Tabs, Tab, NavBar,Divider } from "vant";
import { mapActions, mapGetters } from "vuex";
import { followMe } from "@/api/home";
import {
  uploadAvatar,
  uploadVideo,
  getFavorVideos,
  getFavorUsers
} from "@/api/mine";
import { getWorksList } from "@/api/profile";
import BScroll from "better-scroll";
export default {
  name: "Mine",
  data() {
    return {
      nickname: "",
      avatar: "",
      worksList: [],
      favorsList: [],
      usersList: [],
      hasFollow: true
    };
  },
  components: {
    Uploader,
    [Button.name]: Button,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [NavBar.name]: NavBar,
    [Divider.name]:Divider
  },
  created() {
    if (localStorage.getItem("token")) {
      this.fetchUserInfo().then(val => {
        this.nickname = this.userInfo.userInfo.username;
        this.avatar = this.userInfo.userInfo.avatar;
      });
    } else {
      this.$router.push({
        path: "/login"
      });
    }
    getWorksList({
      who: "mine"
    }).then(val => {
      this.nickname = val.data.message.nickname;
      this.avatar = val.data.message.avatar;
      this.worksList = val.data.message.worksList;
      if (this.worksList.length) {
        this.$nextTick(() => {
          this.scroll_works = new BScroll(this.$refs.workswrapper, {});
        });
      }
    });
    getFavorVideos().then(val => {
      this.favorsList = val.data.message;
    });
    getFavorUsers().then(val => {
      this.usersList = val.data.message;
    });
  },
  watch: {
    favorsList(newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          this.scroll_favors = new BScroll(this.$refs.favorswrapper, {});
        });
      }
    },
    usersList(newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          this.scroll_users = new BScroll(this.$refs.userswrapper, {});
        });
      }
    }
  },
  methods: {
    ...mapActions(["fetchUserInfo"]),
    afterRead(file) {
      let formdata = new FormData();
      formdata.append("name", file.file.name);
      formdata.append("content", file.content);
      uploadAvatar(formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(val => {
        this.avatar = val.data.message;
        localStorage.setItem("avatar", this.avatar);
      });
    },
    jumpHome() {
      this.$router.push({
        path: "/home"
      });
    },
     follow(item) {
      this.hasFollow = !this.hasFollow;
      followMe({ user_id: item.id }).then(val => {
        
      });
    },
    afterSelected(file) {
      this.$router.push({
        path: "/chooseBgm",
        query: {
          name: file.file.name,
          content: file.content
        }
      });
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push({
        path: "/login"
      });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
.Mine {
  .mine_header {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 200px;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
    color: #9face6;

    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(10px);
    }

    position: relative;

    .nickname {
      margin-top: 0.2rem;
      color: #a6c0fe;
      font-weight: 600;
    }

    .avatar {
      margin-top: 10px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #9face6;
      box-sizing: border-box;
    }

    .upload_video_btn {
      border: 0px;
      width: 100px;
      height: 30px;
      background: linear-gradient(to right, #e0c3fc, #8ec5fc);
      color: #fbc2eb;
      border: 1px solid #a6c0fe;
      border-radius: 10px;
      box-shadow: 2px 2px 10px 2px #e8e8e8;
    }

    .logout_btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-weight: 700;
    }
  }

  .no_message {
    text-align: center;
    padding-top: 2rem;
    color: #999;
  }

  .iconfont_style {
    font-size: 60px;
  }

  .no_message_tips {
    font-size: 20px;
    margin-top: 30px;
  }

  .my_nav {
    width: 96%;
    margin: 0 auto;
  }

  .nav_ul {
    margin-bottom: 15px;
    box-shadow: 2px 2px 10px 2px #e8e8e8;
  }

  .nav_li {
    background: #fff;
    padding: 15px;
    font-size: 14px;
    border-radius: 4px;
  }

  .nav_t_li {
    padding: 15px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    position: relative;
  }

  .nav_t_box {
    float: left;
    width: 50%;
    text-align: center;
    box-sizing: border-box;
  }

  .nav_i_box {
    display: inline-block;
    padding: 10px 16px;
    background: linear-gradient(to right, #fbc2eb, #a18cd6);
    color: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .nav_i_box i {
    font-size: 18px;
  }

  .nav_i_bg2 {
    background: linear-gradient(to right, #a1c4fd, #c2e9fb);
  }

  .author_video {
    width: 100%;
    overflow: hidden;
  }

  .author_video_li {
    width: 50%;
    float: left;
    padding: 0 1px 1px 0;
    box-sizing: border-box;
    position: relative;
    height: 331px;
    overflow: hidden;
  }

  .author_video_bg {
    width: 100%;
    height: 330px;
    overflow: hidden;
  }

  .author_video_img {
    width: 100%;
    height: 100%;
  }

  .bo_icon {
    position: absolute;
    top: 40%;
    right: 0;
    left: 0;
    margin: 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
  }

  .author_video_li_bottom {
    position: absolute;
    bottom: 10px;
    color: #fff;
    left: 10px;
  }

  .works_wrapper, .favors_wrapper, .users_wrapper {
    position: relative;
    left: 0;
    top: 0;
    bottom: 0;
    margin: 5px auto;
    width: 96%;
    height: 410px;
    overflow: hidden;
  }

  .users_li {
    display: flex;
    height: 100px;
    justify-content: start;
    align-items: center;
  }

  .user_avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .nickname {
    margin-left 20px
    font-size: 20px;
    font-weight: 500;
    color: #9face6;
  }

  .follow {
    font-size: 30px;
    position absolute
    right 10px
    color: #ddd;
  }

  .follow_active {
    color: #f44;
  }

  .follow_active {
    color: #f44;
    animation: showHeart 0.5s ease-in-out 0s;
  }

  @keyframes showHeart {
    0% {
      color: #f44;
      transform: scale(1);
    }

    25% {
      color: #fff;
      transform: scale(0);
    }

    80% {
      color: #f44;
      transform: scale(1.2);
    }

    100% {
      color: #f44;
      transform: scale(1);
    }
  }
}
</style>