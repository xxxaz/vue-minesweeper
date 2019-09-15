<style scoped lang="scss">
    div {
        cursor: pointer;

        width: 1.5em;
        height: 1.5em;

        background-color: #ccc;
        &.digged {
            background-color: #666;
        }
    }
</style>

<template>
    <div :class="{digged}" @click="dig()" @contextmenu.prevent="mark()">
        {{display()}}
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Status} from './Game.vue';

@Component({props: ['status', 'arounds', 'x', 'y']})
export default class Cell extends Vue{
    status!:Status;
    arounds!: Cell[];
    x!: number;
    y!: number;

    bomb: boolean = false;
    digged: boolean = false;
    marked: boolean = false;

    get mutable(){
        if(this.status != 'playing') return false;
        if(this.digged) return false;
        return true;
    }

    get aroundBombsNumber(){

        return 0;
    }

    display(){
        if(this.marked) return '🚩';
        if(!this.digged){
            if(this.bomb) return '💥';
            return this.aroundBombsNumber || '';
        }

        return '';
    }


    dig(){
        if(!this.mutable) return;
        if(this.marked) return;
        
        this.digged = true;
        this.$emit('update');
    }

    mark(){
        if(!this.mutable) return;
        this.marked = !this.marked;
    }
}
</script>
