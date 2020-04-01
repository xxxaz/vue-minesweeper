<style lang="scss">
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    border: none;
    box-shadow: none;
    background: none;
}
</style>

<style scoped lang="scss">
main {
    h1 {
        padding: 0.2em 0.5em;
    }
    input[type="number"]{
        width: 3em;
        text-align: right;
        &:not(:disabled){
            border: solid 1px black;
        }
    }
    button{
        background-color: #aaa;
        padding: 0.5em;
        cursor: pointer;
        border-radius: 0.2em;
    }
}
</style>

<template>
<main>
    <h1>{{title}}</h1>
    <div>
        <p>
            <input type="number" v-model.number="width" :min="3" :max="30" :disabled="status != 'preparing'" />
            x
            <input type="number" v-model.number="height" :min="3" :max="30" :disabled="status != 'preparing'" />
        </p>
        <p>
            💣：<input type="number" v-model.number="bomb" :min="1" :max="(width * height) / 2" :disabled="status != 'preparing'" />
        </p>
        <button v-if="status == 'preparing'" @click="start">Start</button>
        <button v-else-if="status == 'playing'" @click="finish(false)">Giveup</button>
        <button v-else @click="reset">Reset</button>
    </div>
    <table>
        <tr v-for="y in height" :key="y">
            <td v-for="x in width" :key="x">
                <cell
                    ref="cells"
                    :status="status"
                    :x="x"
                    :y="y"
                    @update="recount()">
                </cell>
            </td>
        </tr>
    </table>
</main>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Cell from "./Cell.vue";

export type Status = 'preparing'|'ready'|'playing'|'successed'|'failured';

const components = {
    'cell': Cell
};

@Component({components})
export default class Game extends Vue{
    status: Status = 'preparing';
    width: number = 10;
    height: number = 10;
    bomb: number = 10;
    currentTime: number = 0;

    private async countUp(){
        const startTime = Date.now();
        while(this.status == 'playing'){
            this.currentTime = Date.now() - startTime;
            await new Promise(r=>requestAnimationFrame(r));
        }
    }

    created(){
        document.title = 'Game';
    }

    get title(): string{
        if(this.status == 'preparing') return "Settings";
        const n = Math.floor(this.currentTime / 1000);
        const d = ('00'+ this.currentTime % 1000).substr(-3);
        return  `${n}.${d} Sec`;
    }

    private cells: Cell[] = [];
    start(){
        if(!this.width) return;
        if(!this.height) return;
        if(!this.bomb) return;

        const refCells = this.$refs.cells;
        if(refCells instanceof Array) this.cells = refCells as Cell[];
        else if(refCells instanceof Cell) this.cells = [refCells];
        else this.cells = [];
        for(let cell of this.cells){
            cell.arounds = this.gatherAroundCells(cell.x, cell.y);
        }
        
        this.status = 'ready';
    }

    private gatherAroundCells(x: number, y: number){
        return this.cells.filter(cell=>{
            if(cell.x == x && cell.y == y) return false;
            if(cell.x < x - 1) return false;
            if(cell.x > x + 1) return false;
            if(cell.y < y - 1) return false;
            if(cell.y > y + 1) return false;
            return true;
        });
    }

    private setBombs(){
        while(this.cells.filter(c=>c.bomb).length < this.bomb){
            const i = Math.floor(Math.random() * this.cells.length);
            if(this.cells[i].digged) continue;
            this.cells[i].bomb = true;
        }
    }

    recount(){
        if(this.status == 'ready'){
            this.setBombs();
            this.status = 'playing';
            this.countUp();
            this.$forceUpdate();
        }

        if(this.cells.find(c=>c.digged && c.bomb)){
            this.finish(false);
            return;
        }

        if(this.cells.every(c=>c.digged || c.bomb)){
            this.finish(true);
            return;
        }
    }

    finish(success: boolean){
        this.status = success ? 'successed' : 'failured';
        alert(this.status);
    }

    reset(){
        for(let cell of this.cells){
            cell.bomb = false;
            cell.digged = false;
            cell.marked = false;
            cell.arounds = [];
        }
        this.status = 'preparing';
    }

}
</script>
