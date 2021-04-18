<template>
  <vue-resizable
    :dragSelector="dragSelector"
      :active="handlers"
      :fit-parent="fit"
      :max-width="maxW"
      :max-height="maxH"
      :min-width="minW"
      :min-height="minH"
      :width="width"
      :height="height"
      :left="left"
      :top="top"
      @mount="eHandler"
      @resize:move="eHandler"
      @resize:start="eHandler"
      @resize:end="editSizeAndPozishionSticker"
      @drag:move="eHandler"
      @drag:start="eHandler"
      @drag:end="editSizeAndPozishionSticker">
    <ui-icon class="delete-icon" style="color:red" @click="deleteClick(sticker.id)">delete_forever</ui-icon>
    <div :class="'sticker-box drag-el '+sticker.color" @dblclick="clickSticker(sticker.id)">
      {{sticker.content}}
    </div>
  </vue-resizable>
</template>

<script>
import VueResizable from 'vue-resizable';
export default{
  name: 'StickerBox',
  components: {
    VueResizable
  },
  props:{
    sticker: Object,
    deleteClick: Function,
    clickSticker: Function,
    socket: Object
  },
  data() {
    const tW = this.sticker.width;
    const tH = this.sticker.height;
    const left = this.sticker.x;
    const top = this.sticker.y;
    return {
      handlers: ["r", "rb", "b", "lb", "l", "lt", "t", "rt"],
      left: `${left}px`,
      top: `${top}px`,
      height: tH,
      width: tW,
      maxW: 250,
      maxH: 250,
      minW: 100,
      minH: 100,
      fit: true,
      event: "",
      dragSelector: ".sticker-box"
    };
  },
  methods: {
    eHandler(data) {
      this.width = data.width;
      this.height = data.height;
      this.left = data.left;
      this.top = data.top;
      this.event = data.eventName;
    },
    editSizeAndPozishionSticker(data){
      let editStic = {
        Id: this.sticker.id,
        X: data.left,
        Y: data.top,
        Content: this.sticker.content,
        Width: data.width,
        Height: data.height,
        Color: this.sticker.color
      }
      this.socket.invoke('EditSticker', {group: 'todolist', model: editStic})
      this.eHandler(data)
    }
  },
}
</script>

<style>
.delete-icon{
  position: absolute;
  right: 0px;
  top: 10px;
  z-index: 1;
}
.resizable-component[data-v-7a68f144]{
  position: absolute
}
.sticker-box{
  position: absolute;
  border: 1px solid #000000;
  margin: 10px;
  height: 100%;
  width: 100%;
}
.white{
  background-color: white;
}
.aqua{
  background-color: aqua;
}
.yellow{
  background-color: yellow;
}
.pink{
  background-color: pink;
}
</style>