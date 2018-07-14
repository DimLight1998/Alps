const { ccclass, property } = cc._decorator;
import { GetLastScore } from './Common';

@ccclass
export default class GameOverController extends cc.Component {
    public onLoad(): void {
        let title: cc.Label = this.node.getChildByName('Title').getComponent(cc.Label) as cc.Label;
        title.string = `Your score\n${GetLastScore()}`;

        this.node.getChildByName('ExitButton').on('click', () => { cc.game.end(); });
        this.node.getChildByName('AgainButton').on('click', () => { cc.director.loadScene('Main'); });
    }
}
