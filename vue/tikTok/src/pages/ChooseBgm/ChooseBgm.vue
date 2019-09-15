<template>
  <div class="bgm">
    <div class="nav">
      <van-nav-bar title="上传背景音乐" left-text="返回" left-arrow @click-left="jumpToMine" />
    </div>
    <div class="content">
      <div class="bg">
        <img
          src="http://47.94.148.11:3000/images/bgmCovers/TIM20190807103957.jpg"
          width="100%"
          height="100%"
          alt="背景图片"
        />
      </div>
      <div class="wrapper" ref="wrapper">
        <div class="content">
          <van-radio-group
          v-for="(item) in bgmList"
          :key="item.id"
          v-model="checkedItem"
          @change="checkItem"
        >
          <div class="item_container">
            <div class="cover_warpper">
              <van-image
                round
                height="80"
                fit="fill"
                show-error
                show-loading
                :src="item.cover_path"
                class="song_cover"
              />
            </div>
            <audio-player :audio="item" class="player"></audio-player>
            <van-radio class="radio" :name="item.id" @click="select(item.id)"></van-radio>
          </div>
        </van-radio-group>
        </div>
      </div>
      <footer>
        <van-cell class="input_tip">
          <input class="video_desc" placeholder="说点什么吧" v-model="desc" />
        </van-cell>
        <van-button
          type="default"
          size="large"
          native-type="submit"
          round
          class="submit_btn"
          @click="upload"
        >上传视频</van-button>
        <van-button type="danger" size="large" native-type="reset" round class="retset_btn">重置</van-button>
      </footer>
    </div>
  </div>
</template>
<script>
import {
  Radio,
  RadioGroup,
  Image,
  Button,
  Field,
  Cell,
  Divider,
  NavBar
} from "vant";
import BScroll from "better-scroll";
import { getBgmList } from "@/api/bgm";
import { getFile, uploadVideo } from "@/api/upload";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";

export default {
  name: "ChooseBgm",
  data() {
    return {
      bgmList: [],
      checkedItem: '',
      desc: ''
    };
  },
  created() {
    getBgmList().then(val => {
      this.bgmList = val.data.message;
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {});
        console.log(this.scroll)
      });
    });
  },
  methods: {
    jumpToMine() {
      this.$router.push({
        path: "/mine"
      });
    },
    select(id) {
      this.checkedItem = id;
    },
    checkItem(name) {
      this.checkedItem = name;
    },
    async upload() {
      let formdata = new FormData();
      formdata.append("name", this.$route.query.name);
      formdata.append("bgmId", this.checkedItem);
      formdata.append("desc", this.desc);
      formdata.append("content", this.$route.query.content);
      uploadVideo(formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(val => {
        this.$router.push({
          path: "/home"
        });
      });
    }
  },
  components: {
    AudioPlayer,
    [Button.name]: Button,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Image.name]: Image,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Divider.name]: Divider,
    [NavBar.name]: NavBar
  }
};
</script>
<style lang='stylus'  ref='stylesheet/stylus' scoped>
.bgm {
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: space-around;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }

  .wrapper {
    position: relative;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height 400px
    overflow: hidden;
  }

  .item_container {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100px;

    .cover_warpper {
      width: 80px;
      padding-bottom: 80px;
      height: 0;
      position: absolute;
      left: 10px;
    }

    .song_cover {
      flex: 1;
    }

    .song_info {
      flex: 3;
      color: #dddddd;
      font-size: 16px;
    }

    .radio {
      position: absolute;
      right: 15px;
    }
  }

  .input_tip {
    margin-bottom: 20px;
    background-color: transparent;
  }

  .video_desc {
    height: 50px;
    border-radius: 20px;
    width: 100%;
    float: right;
    border: 0;
    background-color: rgba(255, 255, 255, 0.8);
  }

  footer {
    position: fixed;
    bottom: 30px;
    width: 100%;
  }

  .submit_btn {
    background-image: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);
    margin-bottom: 20px;
  }

  .retset_btn {
    background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
  }
}
</style>