<template>
  <div class="app" @click="openDialog" @dragover.prevent @drop="dragImg">
    <span class="app" v-if="stickers.length < 1">Add new sticker</span>
    <sticker-box
      v-else
      v-for="stic in stickers"
      :key="stic.id"
      :sticker="stic"
      :ref="'sticker-box' + stic.id"
      :clickSticker="editStickerDialog"
      :deleteClick="deleteSticker"
      :socket="socket"
      :w="stic.width" :h="stic.height" :tw="stic.x" :th="stic.y"
    />

    <ui-dialog style="z-index:100" v-model="open" @confirm="onConfirm" closable>
      <span style="display:none" ref="id" />
      <ui-dialog-title>
        <ui-chips class="colors" v-model="selectedColor" type="choice">
          <ui-chip
            v-for="(item, index) in colors"
            :key="index"
            :value="item"
            :class="(index==selectedColor && 'color active') || 'color'"
            :style="'background-color:' + item + '; width:30px; height:30px'"
          >
          </ui-chip>
        </ui-chips>
        <span class="title">Sticker</span>
      </ui-dialog-title>
      <ui-dialog-content>
        <ui-form-field>
          <ui-textfield ref="content"></ui-textfield>
        </ui-form-field>
      </ui-dialog-content>
      <ui-dialog-actions></ui-dialog-actions>
    </ui-dialog>
  </div>
</template>

<script>
import StickerBox from './components/StickerBox.vue';
import * as SignalR from '@microsoft/signalr';

export default {
  name: 'App',
  components: {
    StickerBox
  },
  data: function() {
    return {
      socket: null,
      stickers: [],
      open: false,
      selectedColor: 0,
      colors: ['aqua', 'pink', 'yellow']
    };
  },
  mounted: function() {
    this.$nextTick(function () {
      this.socket = new SignalR.HubConnectionBuilder()
        .withUrl('https://webapp-210417153800.azurewebsites.net/sticker')
        .withAutomaticReconnect()
        .build();
      this.socket
        .start()
        .then(() => {
          this.socket
            .invoke('JoinGroup', 'todolist')
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
      this.socket.on("allStickers", function (message) {
        console.log({ message });
        this.setStickers( message);
      }.bind(this)),
      this.socket.on("DeleteSticker", function (message) {
        console.log("DeleteSticker" + { message });
        this.setStickers( message);
      }.bind(this)),
      this.socket.on("AddStickerSuccess", function (message) {
        console.log("AddStickerSuccess"+ { message });
        this.setStickers( message);
      }.bind(this)),
      this.socket.on("EditStickerSuccess", function (message) {
        console.log("EditStickerSuccess" + { message });
        this.setStickers( message);
      }.bind(this))
    });
    console.log(this.stickers);
  },
  methods: {
    setStickers(stickArray){
      this.stickers = stickArray;
    },
    getStickers(){
    },
    openDialog(event) {
      if (event.target.classList.contains('app')) {
        this.open = true;
      }
    },
    dragImg(e){
      e.stopPropagation();
      e.preventDefault();
      // let files = e.dataTransfer.files;
    },
    createNewSticker() {
      let newSticker = {
        Id: "dsgsfag",
        Content: this.$refs.content.inputValue,
        Color: this.colors[this.selectedColor],
        Width: 150,
        Height: 150,
        X: Math.floor(Math.random() * 500),
        Y: Math.floor(Math.random() * 500)
      };
      this.socket.invoke('AddSticker', {group: 'todolist', model: newSticker});
      this.$refs.content.inputValue = '';
    },
    onConfirm(result) {
      if (result === true) {
        if (this.$refs.id.innerText !== ''){
            this.editSticker()
          }else{
            this.createNewSticker();
          }
      } else {
        console.log('cancel');
        this.open = false;
      }
    },
    deleteSticker(id) {
      this.socket.invoke('DeleteSticker', {group: 'todolist', id})
    },
    editSticker() {
      let index = this.stickers.indexOf(
        this.stickers.find(item => item.id == this.$refs.id.innerText)
      );
      let editSticker = {
        Id: this.stickers[index].id,
        Content: this.$refs.content.inputValue,
        Color: this.colors[this.selectedColor],
        X: this.stickers[index].x,
        Y: this.stickers[index].y,
        Width: this.stickers[index].width,
        Height: this.stickers[index].height
      }
      this.$refs.id.innerText = '';
      this.$refs.content.inputValue = '';
      this.socket.invoke('EditSticker',{group: 'todolist', model: editSticker});
    },
    editStickerDialog(id) {
      let stic = this.stickers.find(item => (item.id === id));
      this.$refs.content.inputValue = stic.content;
      this.selectedColor = this.colors.indexOf(stic.color);
      this.$refs.id.innerText = id;
      this.open = true;
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}

.app {
  width: 100%;
  height: 100%;
}
.colors, .inactive {
  position: absolute;
  top: 10px;
  left: 10px;
}
.color{
  opacity: 0.3;
}
.title{
  position: absolute;
  top: 15px;
  right: 10px;
}
.color.active, .color:hover{
  opacity: 1;
}
</style>