<template>
  <div class="container_box" id="video_box">
    <div class="van_swipe">
      <!--vant van-swipe 滑动组件 -->
      <van-swipe :show-indicators="false" @change="onChange" vertical :loop="false">
        <van-swipe-item v-for="(item, index) in videoList" :key="index" class="product_swiper">
          <div class="video_container">
            <!--video属性
                    webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
                    微信内置x5内核，
                    x5-video-player-type="h5" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
                    x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
                    x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
                    x5-playsinline="" 使安卓实现h5同层播放，实现与ios同样效果，但兼容部分机型
                    poster：封面
                    src：播放地址
            -->
            <video
              class="video_box"
              width="100%"
              height="100%"
              webkit-playsinline="true"
              x5-playsinline
              x5-video-player-type="h5"
              x5-video-player-fullscreen
              playsinline
              preload="auto"
              :poster="item.cover_path"
              :src="item.video_path"
              :playOrPause="playOrPause"
              x-webkit-airplay="allow"
              x5-video-orientation="portrait"
              @click="pauseVideo"
              @ended="onPlayerEnded($event)"
              loop="loop"
            ></video>
            <!-- 封面 -->
            <img v-show="isVideoShow" class="play" @click="playvideo" :src="item.cover" />
            <!-- 播放暂停按钮 -->
            <img
              v-show="iconPlayShow"
              class="icon_play"
              @click="playvideo"
              src="./../../assets/images/icon_play.png"
            />
          </div>
          <!-- 右侧点赞、分享功能 -->
          <div class="tools_right">
            <div class="tools_r_li">
              <img :src="item.avatar" class="tag_image" @click="toAuthorHome(item)" />
            </div>
            <div class="tools_r_li" @click="changeFollow(item)">
              <i class="iconfont icon_right" :class="item.follow?'follow_active':''">&#xe6d6;</i>
              <div class="tools_r_num">{{item.like_counts}}</div>
            </div>
            <div class="tools_r_li" @click="changeComments(item)">
              <i class="iconfont icon_right">&#xe62c;</i>
              <div class="tools_r_num">{{item.comment_counts}}</div>
            </div>
            <div class="tools_r_li" @click="changeShare">
              <i class="iconfont icon_right">&#xe612;</i>
              <div class="tools_r_num">5.5w</div>
            </div>
          </div>
          <!-- 底部作品描述 -->
          <div class="production_box">
            <div class="production_name" v-text="'@ '+item.nickname"></div>
            <div class="production_des" v-text="item.video_desc"></div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <!--底部操作栏-->
      <div class="container_bottom">
        <div class="bottom_tab" :class="tabIndex==0?'tab_active':''" @click="changeTab(0)">
          <span class="bottom_tab_span">首页</span>
        </div>
        <div class="bottom_tab" :class="tabIndex==1?'tab_active':''" @click="changeTab(1)">
          <span class="bottom_tab_span">我的</span>
        </div>
      </div>
      <!--分享弹框-->
      <van-popup v-model="commentPop" :overlay="true" class="comment_container" position="bottom">
        <div class="comment_box">
          <div class="comment_top">
            {{commentList.length}}条评论
            <i
              class="iconfont icon-guanbi1 guanbi3"
              @click="closeCommentsBox"
            >&#xe647;</i>
          </div>
          <ul class="comment_ul">
            <div v-if="commentList.length!=0">
              <transition-group appear>
                <li
                  class="comment_li"
                  v-for="(item,index) in commentList"
                  :key="item.id"
                  @click="replyUser(item,index,-1)"
                >
                  <div class="comment_author_left">
                    <img :src="item.avatar" />
                  </div>
                  <div class="comment_author_right">
                    <div class="comment_author_top">
                      <div class="comment_author_name">{{item.nickname}}</div>
                      <div class="icon-shoucang1_box" @click.stop="commentLike(item,index,-1)">
                        <div class="icon_right_change" :class="item.has_like?'love_active':''">
                          <i class="iconfont icon-shoucang1">&#xe689;</i>
                        </div>
                        <div class="shoucang1_num">{{item.like_counts}}</div>
                      </div>
                    </div>
                    <div class="comment_author_text">
                      {{item.comment}}
                      <span>{{item.create_time}}</span>
                    </div>
                  </div>
                  <div class="clear"></div>
                  <div class="comment_reply_box">
                    <transition-group appear>
                      <div
                        class="comment_reply_li"
                        v-for="(item2,index2) in item.child_comments"
                        :key="item2.id"
                        @click.stop="replyUser(item2,index,index2)"
                      >
                        <div class="comment_reply_left">
                          <img :src="item2.avatar" />
                        </div>
                        <div class="comment_reply_right">
                          <div class="comment_reply_top">
                            <div class="comment_reply_name">@{{item2.nickname}}</div>
                            <div
                              class="icon-shoucang1_box"
                              @click.stop="commentLike(item2,index,index2)"
                            >
                              <div
                                class="icon_right_change"
                                :class="item2.love_comment?'love_active':''"
                              >
                                <i class="iconfont icon-shoucang1">&#xe689;</i>
                              </div>
                              <div class="shoucang1_num">{{item2.like_counts}}</div>
                            </div>
                          </div>
                          <div class="comment_reply_text">
                            <span>
                              回复
                              {{item2.nickname}}：
                            </span>
                            {{item2.comment}}
                            <span>{{item2.create_time}}</span>
                          </div>
                        </div>
                        <div class="clear"></div>
                      </div>
                    </transition-group>
                  </div>
                </li>
              </transition-group>
            </div>
            <div class="no_message" v-if="!commentList.length">
              <i class="iconfont iconfont_style icon-zanwupinglun"></i>
              <br />
              <div class="no_message_tips">暂无评论</div>
            </div>
          </ul>
        </div>
      </van-popup>
      <div class="comment_input_box_hover"></div>
      <div class="comment_input_box" v-show="commentPop">
        <input
          :placeholder="commentPlaceholder"
          class="comment_input"
          v-model="comment_text"
          ref="content"
        />
        <div class="comment_input_right" @click="checkComment">
          <i class="iconfont icon-fasong comment_i" :class="canSend?'comment_i_active':''">&#xe608;</i>
        </div>
      </div>
      <div class="page_loading_box">
        <div class="spinner3">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
      </div>
      <div class="share_box" :class="showShareBox?'share_active':''">
        <div class="share_tips">分享到</div>
        <ul class="share_ul">
          <li class="share_li pengyouquan_li">
            <i class="iconfont pengyouquan">&#xe603;</i>
          </li>
          <li class="share_li">
            <i class="iconfont weixin">&#xe67a;</i>
          </li>
          <li class="share_li" @click="copyUrl">
            <i class="iconfont lianjie">&#xe67b;</i>
          </li>
          <div class="clear"></div>
        </ul>
        <div class="share_cancel" @click="cancelShare">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Skeleton, Popup, Toast } from "vant";
import $ from "jquery";
import {
  getVideoList,
  likeVideo,
  getCommentList,
  sendComment,
  likeComment
} from "@/api/home";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Skeleton.name]: Skeleton,
    [Popup.name]: Popup
  },
  created() {
    getVideoList().then(val => {
      let data = val.data.message;
      data.forEach(item => {
        item.follow = false;
      });
      this.videoList = data;
    });
  },
  computed: {
    ...mapGetters(["isLogin", "userInfo"])
  },
  watch: {
    comment_text(newVal) {
      this.canSend = newVal === "" ? false : true;
    }
  },
  data() {
    let u = navigator.userAgent;
    return {
      current: 0,
      videoList: [],
      commentList: [],
      canSend: false,
      hasFollow: false,
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true,
      isAndroid: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
      isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      tabIndex: 0,
      showShareBox: false,
      commentPop: false,
      comment_text: "",
      video_id: "",
      to_user_id: "",
      father_comment_id: "",
      replyUserComment: null,
      commentPlaceholder: "留下你精彩的评论吧",
      hasSend: false,
      canSend: false,
      showClock: false,
      didLike: false,
      comment_nums:0,
    };
  },
  mounted() {
    if (this.isios) {
      $(document).on("focusout", function() {
        //软键盘收起的事件处理
        this.showClock = false;
        window.scroll(0, 0);
      });
    } else {
      let winHeight = $(window).height(); //获取当前页面高度
      $(window).resize(function() {
        let thisHeight = $(this).height();
        if (winHeight - thisHeight > 140) {
          //键盘弹出
        } else {
          //键盘收起
          this.commentPlaceholder = "留下你精彩的评论吧";
          if (!this.isSending) {
            setTimeout(() => {
              this.replayUserData = "";
            }, 1000);
          }
        }
      });
    }
  },
  methods: {
    //改变菜单
    changeTab(index) {
      this.tabIndex = index;
      if (this.tabIndex === 1) {
        this.$router.push({
          path: "/mine"
        });
      }
    },
    toAuthorHome(item) {
      this.$router.push({
        path: "/profile",
        query: { id: item.user_id }
      });
    },
    //改变收藏状态
    changeFollow(item) {
      item.follow = !item.follow;
      item.like_counts = item.follow
        ? item.like_counts + 1
        : item.like_counts - 1;
      likeVideo({ user_id: item.user_id, video_id: item.id });
    },
    changeComments(item) {
      if (this.showShareBox) {
        // 打开评论弹窗之前，要先关闭分享弹窗
        this.commentPop = false;
      }
      this.comment_nums = item.comment_counts
      this.commentPop = true;
      this.video_id = item.id;
      getCommentList(this.video_id).then(val => {
        this.commentList = val.data.message;
      });
    },
    checkComment() {
      if (this.comment_text == "") {
        Toast("评论内容不能为空");
      } else {
        if (!this.isLogin) {
          this.$router.push({
            path: "/login"
          });
          return;
        }
        let father_comment_id = ""; // 默认父评论为null
        let to_user_id = "";
        let video_id = this.video_id;
        let comment = this.comment_text;
        const id = Date.now();
        const newComment = {
          avatar: this.userInfo.userInfo.avatar,
          comment,
          id,
          create_time: "刚刚",
          nickname: this.userInfo.userInfo.nickname,
          like_counts: 0
        };
        if (this.replyUserComment) {
          // 说明不是根评论，而是子评论
          father_comment_id = this.replyUserComment.id; // 让father_comment_id 指向这个评论
          to_user_id = this.replyUserComment.from_user_id; // 让to_user_id指向父级评论的from_user_id
        }
        sendComment({ to_user_id, father_comment_id, comment, video_id }).then(
          val => {
            this.comment_text = "";
            this.hasSend = true;
            if (!this.replyUserComment) {
              this.commentList.unshift(newComment);
            } else {
              let index = this.replyUserComment.index;
              let index2 = this.replyUserComment.index2;
              if (this.replyUserComment.index2 == -1) {
                //回复一级人
                this.commentList[index].child_comments.unshift(newComment);
              } else {
                //回复二级人
                this.commentList[index].child_comments.splice(
                  index2,
                  0,
                  newComment
                );
              }
            }
          }
        );
      }
    },
    closeCommentsBox() {
      this.commentPop = false;
    },
    replyUser(item, index, index2) {
      item.index = index;
      item.index2 = index2;
      this.replyUserComment = item;
      this.commentPlaceholder = `回复 @${item.nickname}：`;
      this.$refs.content.focus();
    },
    commentLike(item, index, index2) {
      const comment_id = item.id;
      item.has_like = item.has_like ? 0 : 1;
      let flag = item.has_like ? 1 : 0;
      likeComment({ comment_id, flag }).then(val => {
        if (index2 === -1) {
          //为根评论点赞
          if (flag) {
            this.commentList[index].like_counts++;
          } else {
            this.commentList[index].like_counts--;
          }
        } else {
          if (flag) {
            this.commentList[index].child_comments[index2].like_counts++;
          } else {
            this.commentList[index].child_comments[index2].like_counts--;
          }
        }
      });
    },
    //展示分享弹窗
    changeShare() {
      this.showShareBox = true;
    },
    //取消分享
    cancelShare() {
      this.showShareBox = false;
    },
    //滑动改变播放的视频
    onChange(index) {
      //改变的时候 暂停当前播放的视频
      let video = document.querySelectorAll("video")[this.current];
      video.pause();
      this.playOrPause = false;
      this.current = index;
      if (this.isiOS) {
        //ios切换直接自动播放下一个
        this.isVideoShow = false;
        this.pauseVideo();
      } else {
        //安卓播放时重置显示封面。图标等
        this.isVideoShow = true;
        this.iconPlayShow = true;
      }
    },
    playvideo(event) {
      let video = document.querySelectorAll("video")[this.current];
      this.isVideoShow = false;
      this.iconPlayShow = false;
      video.play();
      window.onresize = function() {
        video.style.width = `${window.innerWidth}px`;
        video.style.height = `${window.innerHeight}px`;
      };
    },
    pauseVideo() {
      //暂停\播放
      let video = document.querySelectorAll("video")[this.current];
      if (this.playOrPause) {
        video.pause();
        this.iconPlayShow = true;
      } else {
        video.play();
        this.iconPlayShow = false;
      }
      this.playOrPause = !this.playOrPause;
    },
    onPlayerEnded(player) {
      //视频结束
      this.isVideoShow = true;
      this.current += this.current;
    },
    //复制当前链接
    copyUrl() {
      let httpUrl = window.location.href;
      var oInput = document.createElement("input");
      oInput.value = httpUrl;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      alert("链接复制成功");
    }
  }
};
</script>
<style scoped>
.clear {
  clear: both;
}

.video-player {
  height: 100vh;
  width: 100vw;
}

.product_swiper {
  width: 100vw;
  height: 100vh;
}

.van_swipe {
  width: 100vw;
  height: 100vh;
}

.van-swipe {
  width: 100%;
  height: 100%;
}

.container_box {
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.video_box {
  object-fit: fill !important;
  z-index: 999;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}

video {
  object-position: 0 0;
}

.icon_play {
  position: absolute;
  top: 44%;
  right: 0;
  left: 0;
  bottom: auto;
  margin: auto;
  z-index: 999;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.play,
.platStart {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
}

/* 点赞，转发 */
.tools_right {
  z-index: 1001;
  position: absolute;
  right: 16px;
  bottom: 156px;
}
.tag_image {
  width: 60px;
  height: 60px;
  border: 1px solid #fff;
  box-sizing: border-box;
  border-radius: 50%;
  position: relative;
  bottom:10px;
}
.tag_image_active {
  margin-bottom: 10px;
}
.tools_r_li {
  margin-bottom: 4px;
  color: #fff;
  height: 73px;
  position: relative;
  text-align: center;
}

.tools_r_li:last-child {
  margin-bottom: 0px;
}

.icon_right {
  margin-bottom: 5px;
  font-size: 42px;
  display: block;
  text-shadow: 0px 0px 10px #9d9d9d;
  /*transition: .5s;*/
}
/*评论样式*/
.comment_container {
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.comment_box {
  padding: 0 15px 52px 15px;
}

.comment_top {
  text-align: center;
  font-size: 12px;
  color: #000;
  line-height: 40px;
}

.guanbi3 {
  float: right;
  font-size: 12px;
  padding: 0 10px;
  position: absolute;
  right: 6px;
}

.comment_li {
  margin-bottom: 20px;
  font-size: 14px;
}

.comment_author_left {
  float: left;
}

.comment_author_left img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.comment_author_right {
  margin-left: 46px;
  padding-top: 4px;
}

.comment_author_top {
  position: relative;
}

.comment_author_name {
  margin-bottom: 6px;
  color: #777;
}

.icon-shoucang1_box {
  position: absolute;
  right: 0px;
  top: 0;
  text-align: center;
}

.comment_author_text {
  color: #555;
  margin-bottom: 10px;
  padding-right: 35px;
}

.comment_reply_box {
  padding-left: 46px;
  box-sizing: border-box;
}

.comment_reply_li {
  margin-bottom: 10px;
}

.comment_reply_left {
  float: left;
}

.comment_reply_left img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.comment_reply_right {
  margin-left: 35px;
  padding-top: 2px;
}

.comment_reply_top {
  position: relative;
  margin-bottom: 6px;
}

.comment_reply_text {
  padding-right: 35px;
  margin-bottom: 10px;
  color: #555;
}

.comment_author_text span,
.comment_reply_text span {
  color: #999;
  font-size: 13px;
  margin-left: 6px;
}

.shoucang1_num {
  text-align: center;
  width: 30px;
  font-size: 12px;
  /* right: -4px; */
  position: relative;
}

.comment_ul {
  height: 400px;
  overflow-y: auto;
}

.comment_input_box {
  position: fixed;
  bottom: 0;
  z-index: 2999;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  background: #fff;
  padding: 10px 15px;
}
.comment_input {
  border: none;
  resize: none;
  width: 80%;
  float: left;
  color: #555;
  caret-color: #f44;
}

.comment_input_right {
  float: right;
  padding-right: 25px;
}

.comment_i {
  font-size: 24px;
  color: #999;
  transition: 0.3s;
}

.comment_i_active {
  color: #f44;
}

.icon-zanwupinglun {
  font-size: 100px;
}

.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateY(80px);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

/*添加进场效果*/
.v-move {
  transition: all 1s ease;
}

.v-leave-active {
  position: absolute;
}

.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}

.love_active {
  color: #f44;
}

.production_box {
  z-index: 1001;
  position: absolute;
  /* right: 16px; */
  bottom: 60px;
  text-align: left;
  padding: 0 15px 15px 15px;
  color: #fff;
  width: 100%;
  left: 0;
  box-sizing: border-box;
  background: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0)
  );
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
  /* 标准的语法 */
}

.production_name {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 10px;
}

.production_des {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  min-height: 62px;
}

.container_bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  height: 60px;
}

.production_top {
  display: inline-block;
  padding: 6px;
  margin-bottom: 5px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  margin-top: 5px;
}

.product_go {
  color: #fbdd21;
}

.production_title {
  margin-left: 4px;
}

.bottom_tab {
  width: 50%;
  text-align: center;
  float: left;
  color: #c9c9c9;
  padding: 10px 0;
}

.bottom_tab_span {
  line-height: 38px;
  border-bottom: 2px solid transparent;
  font-weight: 600;
  font-size: 16px;
  display: inline-block;
  padding: 0 4px;
  transition: 0.5s all;
}

.tab_active .bottom_tab_span {
  border-bottom: 2px solid #fff;
  color: #fff;
}

.icon-shoucang {
  transition: 0.8s all;
}

.follow_active {
  color: #f44;
  animation: showHeart 0.5s ease-in-out 0s;
}

/*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
/*animation-duration ：指定元素播放动画所持续的时间*/
/*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
/*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
/*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
/*animation-direction：主要用来设置动画播放方向*/
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
/*评论样式*/
.comments_box {
  position: fixed;
  bottom: -1000px;
  width: 100%;
  z-index: 1002;
  background: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: 0.5s;
}
.comments_tips {
  text-align: center;
  line-height: 38px;
  font-size: 14px;
  color: #333;
}
.comments_ul {
  height: 400px;
}
.icon_close_comments {
  font-size: 14px;
  position: absolute;
  right: 16px;
}
.comments_input_wrapper {
  position: relative;
  z-index: 99;
  display: flex;
  align-items: center;
  height: 50px;
  border: 1px solid #e8e8e8;
}
.comments_input {
  margin-left: 15px;
  flex: 4;
  border: 0px;
}
.submit_btn {
  flex: 1;
  background: transparent;
  border: 0px;
  position: absolute;
  right: 10px;
}
.submit_btn_text {
  font-size: 30px;
  color: #888;
}
.comments_active {
  bottom: 0px;
}
.no_message {
  color: #ccc;
  margin: 20px auto;
  text-align: center;
}
/*分享样式*/
.share_box {
  position: fixed;
  bottom: -300px;
  width: 100%;
  z-index: 1002;
  background: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: 0.5s;
}

.share_tips {
  text-align: center;
  line-height: 38px;
  color: #333;
}

.share_ul {
  box-sizing: border-box;
  padding: 0 25px 25px;
  border-bottom: 1px solid #e8e8e8;
}

.share_li {
  float: left;
  width: 33%;
  text-align: center;
}

.share_li i {
  font-size: 44px;
}

.share_cancel {
  text-align: center;
  line-height: 48px;
  color: #777;
  text-align: center;
}

.pengyouquan {
  color: #47d000;
}

.pengyouquan_li {
  animation: rotating 8s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.weixin {
  color: #20ca2e;
}

.lianjie {
  color: #cdcdcd;
}
.share_active {
  display: block;
  bottom: 0px;
}
</style>
