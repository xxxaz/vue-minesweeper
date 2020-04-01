<style scoped lang="scss">
    div {
        width: 1.5em;
        height: 1.5em;
        text-align: center;

        background-color: #ccc;
        &.digged {
            background-color: #666;
        }
        &.mutable {
            cursor: pointer;
        }
    }
</style>

<template>
    <div :class="{digged, mutable}" @click="dig()" @contextmenu.prevent="mark()">
        {{display()}}
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Status} from './Game.vue';

@Component({props: ['status', 'x', 'y']})
export default class Cell extends Vue{
    readonly status!: Status;
    readonly x!: number;
    readonly y!: number;

    arounds: Cell[] = [];
    bomb: boolean = false;
    digged: boolean = false;
    marked: boolean = false;

    get mutable(){
        if(this.digged) return false;
        if(!['ready', 'playing'].includes(this.status)) return false;
        return true;
    }

    get aroundBombsNumber(){
        return this.arounds.filter(c=>c.bomb).length;
    }

    display(){
        if(this.bomb){
            if(this.digged) return '💥';
            if(this.status == 'failured') return '💣';
            if(this.status == 'successed') return '💣';
        }
        if(this.digged) return this.aroundBombsNumber || '';
        return this.marked ? '🚩' : '';
    }

    dig(){
        if(this.marked) return;
        if(!this.mutable) return;
        this.digged = true;
        this.$emit('update');
        
        if(!this.bomb && !this.aroundBombsNumber){
            for(let cell of this.arounds) cell.dig();
        }
    }

    mark(){
        if(!this.mutable) return;
        this.marked = !this.marked;
    }
}
</script>
