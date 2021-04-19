<template>
	<vue-resizable
		style="position: absolute"
		:dragSelector="dragSelector"
		:active="handlers"
		:fit-parent="fit"
		:max-width="maxW"
		:max-height="maxH"
		:min-width="minW"
		:min-height="minH"
		:width="sticker.width"
		:height="sticker.height"
		:left="sticker.x"
		:top="sticker.y"
		@resize:end="editSizeAndPozishionSticker"
		@drag:end="editSizeAndPozishionSticker"
	>
		<ui-icon
			class="delete-icon"
			style="color:red"
			@click="deleteClick(sticker.id)"
			>delete_forever</ui-icon
		>
		<div
			:class="'sticker-box drag-el ' + sticker.color"
			@dblclick="clickSticker(sticker.id)"
		>
			<span v-if="sticker.content">{{ sticker.content }}</span>
			<div v-else class="imagediv">
				<img class="image" :src="sticker.url" draggable="false" />
			</div>
		</div>
	</vue-resizable>
</template>

<script>
import VueResizable from "vue-resizable";
export default {
	name: "StickerBox",
	components: {
		VueResizable,
	},
	props: {
		sticker: Object,
		deleteClick: Function,
		clickSticker: Function,
		socket: Object,
	},
	data() {
		return {
			handlers: ["r", "rb", "b", "lb", "l", "lt", "t", "rt"],
			maxW: 250,
			maxH: 250,
			minW: 100,
			minH: 100,
			fit: true,
			event: "",
			dragSelector: ".sticker-box",
		};
	},
	methods: {
		onIgameDrag(e) {
			e.preventDefault();
		},
		editSizeAndPozishionSticker(data) {
			let editStic = {
				Id: this.sticker.id,
				X: data.left,
				Y: data.top,
				Content: this.sticker.content,
				Url: this.sticker.url,
				Width: data.width,
				Height: data.height,
				Color: this.sticker.color,
			};
			this.socket.invoke("EditSticker", { group: "todolist", model: editStic });
		},
	},
};
</script>

<style>
.delete-icon {
	position: absolute;
	right: 0px;
	top: 10px;
	z-index: 1;
	cursor: pointer;
}
.resizable-component[data-v-7a68f144] {
	position: absolute;
}
.sticker-box {
	position: absolute;
	border: 1px solid #000000;
	border-radius: 14px;
	margin: 10px;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.aqua {
	background-color: aqua;
	border-color: aqua;
}
.yellow {
	background-color: yellow;
	border-color: yellow;
}
.pink {
	background-color: pink;
	border-color: pink;
}
.sticker-box img {
	width: 100%;
	height: 100%;
}
.imagediv {
	width: 80%;
	height: 80%;
	margin: 10% auto;
}
</style>
