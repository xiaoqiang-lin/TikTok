<template>
  <div class="profile">
    <van-nav-bar title="个人中心" left-text="返回" left-arrow @click-left="jumpHome" class="header_nav" />
    <header class="profile_header author_top">
      <div class="bg">
        <img
          src="http://47.94.148.11:3000/images/bgmCovers/TIM20190807103957.jpg"
          alt="bg"
          width="100%"
          height="180px"
          class="author_bg"
        />
      </div>
      <div class="author_box">
        <div class="author_left">
          <img :src="avatar" class="author_avatar" />
          <i class="iconfont" @click="follow" :class="hasFollow?'follow_active':''">&#xe6d6;</i>
        </div>
        <div class="author_right">
          <div class="author_name">
            <span>{{nickname}}</span>
          </div>
          <div class="author_des">但行好事，莫问前程。</div>
        </div>
      </div>
    </header>
    <van-tabs v-model="active" swipeable>
      <van-tab title="作品">
        <div ref="wrapper" class="wrapper">
          <ul class="author_video content">
            <li
              class="author_video_li"
              v-for="(item) in worksList"
              @click="toDetail(item)"
              :key="item.id"
            >
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
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Uploader, Button, Tabs, Tab, NavBar } from "vant";
import { mapActions, mapGetters } from "vuex";
import BScroll from "better-scroll";
import { getWorksList } from "@/api/profile";
import { followMe } from "@/api/home";
export default {
  name: "Profile",
  data() {
    return {
      active: 0,
      nickname: "",
      avatar: "",
      worksList: [],
      hasFollow: false
    };
  },
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [NavBar.name]: NavBar
  },
  created() {
    getWorksList({
      who: "others",
      id: this.$route.query.id
    }).then(val => {
      this.nickname = val.data.message.nickname;
      this.avatar = val.data.message.avatar;
      this.worksList = val.data.message.worksList;
      this.hasFollow = val.data.message.hasFollow;
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {});
      });
    });
  },
  methods: {
    jumpHome() {
      this.$router.back();
    },
    follow() {
      this.hasFollow = !this.hasFollow;
      followMe({ user_id: this.$route.query.id })
    }
  }
};
</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
.profile {
  .profile_header {
    width: 100%;
    margin-bottom: 20px;
    color: #9face6;
    position: relative;
    height: 150px;

    .author_bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(10px);
    }

    .author_box {
      position: absolute;
      top: 19%;
      text-align: center;
      width: 100%;
      color: #fff;
      padding: 0 10px;
      box-sizing: border-box;
      z-index: 1;
      display: flex;
    }

    .author_left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
    }

    .author_avatar {
      float: left;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #fff;
      border: 4px solid rgba(10, 10, 10, 0.2);
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    .iconfont {
      font-size: 24px;
      margin-left: 28px;
      color: #ddd;
    }

    .follow_active {
      color: #f44;
    }

    .author_right {
      padding-top: 10px;
    }

    .author_name {
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .author_des{
      padding-left 20px
      margin-bottom: 10px;
      font-size: 18px;
    }
  }

  .wrapper {
    position: relative;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 410px;
    overflow: hidden;
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